// Server-only store untuk permintaan notifikasi stok kembali (PRD §9 Fase 3).
import fs from "fs";
import path from "path";
import type { RestockRequest } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "restock.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readRestock(): RestockRequest[] {
  // Baca tanpa menulis: di serverless read-only (Vercel) file tak ada &
  // tak bisa dibuat. Bila absen/gagal → daftar kosong.
  try {
    if (!fs.existsSync(FILE)) return [];
    const list = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeRestock(list: RestockRequest[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

export function getAllRestock(): RestockRequest[] {
  return readRestock().sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function addRestock(input: {
  product_id: string;
  product_name: string;
  contact: string;
}): { ok: boolean; error?: string; request?: RestockRequest } {
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
  const list = readRestock();
  list.push(request);
  writeRestock(list);
  return { ok: true, request };
}

export function deleteRestock(id: string): boolean {
  const list = readRestock();
  const next = list.filter((r) => r.id !== id);
  if (next.length === list.length) return false;
  writeRestock(next);
  return true;
}
