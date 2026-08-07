// Server-only store untuk permintaan notifikasi stok kembali (PRD §9 Fase 3).
//
// Dua mode (lihat docs/DB_MIGRATION_PLAN.md):
//   • DATABASE_URL diset  → PostgreSQL/Supabase via Drizzle (produksi).
//   • DATABASE_URL kosong → fallback file data/restock.json (dev/self-host).
import fs from "fs";
import path from "path";
import { eq, desc } from "drizzle-orm";
import { db, requireDb, withRetry } from "./db/client";
import { restockRequests as restockTable } from "./db/schema";
import type { RestockRequest } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "restock.json");

// ── Konversi baris DB ↔ objek RestockRequest ──
type Row = typeof restockTable.$inferSelect;

function rowToRestock(r: Row): RestockRequest {
  return {
    id: r.id,
    product_id: r.productId,
    product_name: r.productName,
    contact: r.contact,
    created_at: r.createdAt.toISOString(),
  };
}

// ── Fallback file (perilaku lama) ──
function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readRestockFile(): RestockRequest[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const list = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeRestockFile(list: RestockRequest[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

export async function readRestock(): Promise<RestockRequest[]> {
  if (db) {
    const rows = await withRetry(() => db!.select().from(restockTable));
    return rows.map(rowToRestock);
  }
  return readRestockFile();
}

export async function getAllRestock(): Promise<RestockRequest[]> {
  if (db) {
    const rows = await withRetry(() =>
      db!.select().from(restockTable).orderBy(desc(restockTable.createdAt))
    );
    return rows.map(rowToRestock);
  }
  return readRestockFile().sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function addRestock(input: {
  product_id: string;
  product_name: string;
  contact: string;
}): Promise<{ ok: boolean; error?: string; request?: RestockRequest }> {
  const contact = (input.contact ?? "").toString().trim().slice(0, 80);
  if (!input.product_id)
    return { ok: false, error: "Produk tidak valid." };
  if (!contact)
    return { ok: false, error: "Isi nomor WhatsApp atau email Anda." };

  const request: RestockRequest = {
    id: globalThis.crypto?.randomUUID?.() ?? `rs-${Date.now()}`,
    product_id: input.product_id,
    product_name: (input.product_name ?? "").toString().slice(0, 120),
    contact,
    created_at: new Date().toISOString(),
  };

  if (db) {
    await requireDb().insert(restockTable).values({
      id: request.id,
      productId: request.product_id,
      productName: request.product_name,
      contact: request.contact,
    });
    return { ok: true, request };
  }

  const list = readRestockFile();
  list.push(request);
  writeRestockFile(list);
  return { ok: true, request };
}

export async function deleteRestock(id: string): Promise<boolean> {
  if (db) {
    const rows = await requireDb()
      .delete(restockTable)
      .where(eq(restockTable.id, id))
      .returning({ id: restockTable.id });
    return rows.length > 0;
  }

  const list = readRestockFile();
  const next = list.filter((r) => r.id !== id);
  if (next.length === list.length) return false;
  writeRestockFile(next);
  return true;
}
