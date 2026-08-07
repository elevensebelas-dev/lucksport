// Server-only store untuk ulasan & rating produk (PRD §9 Fase 3).
//
// Dua mode (lihat docs/DB_MIGRATION_PLAN.md):
//   • DATABASE_URL diset  → PostgreSQL/Supabase via Drizzle (produksi).
//   • DATABASE_URL kosong → fallback file data/reviews.json (dev/self-host).
import fs from "fs";
import path from "path";
import { eq, desc, and } from "drizzle-orm";
import { db, requireDb, withRetry } from "./db/client";
import { reviews as reviewsTable } from "./db/schema";
import type { Review } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "reviews.json");

// ── Konversi baris DB ↔ objek Review (bentuk snake_case lib/types.ts) ──
type Row = typeof reviewsTable.$inferSelect;

function rowToReview(r: Row): Review {
  return {
    id: r.id,
    product_id: r.productId,
    name: r.name,
    rating: r.rating,
    comment: r.comment,
    approved: r.approved,
    created_at: r.createdAt.toISOString(),
  };
}

// ── Fallback file (perilaku lama) ──
function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readReviewsFile(): Review[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const list = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeReviewsFile(list: Review[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

export async function readReviews(): Promise<Review[]> {
  if (db) {
    const rows = await withRetry(() => db!.select().from(reviewsTable));
    return rows.map(rowToReview);
  }
  return readReviewsFile();
}

// Ulasan yang tampil di storefront (sudah disetujui), terbaru dulu.
export async function getApprovedReviews(productId: string): Promise<Review[]> {
  if (db) {
    const rows = await withRetry(() =>
      db!
        .select()
        .from(reviewsTable)
        .where(
          and(
            eq(reviewsTable.productId, productId),
            eq(reviewsTable.approved, true)
          )
        )
        .orderBy(desc(reviewsTable.createdAt))
    );
    return rows.map(rowToReview);
  }
  return readReviewsFile()
    .filter((r) => r.product_id === productId && r.approved)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function getAllReviews(): Promise<Review[]> {
  if (db) {
    const rows = await withRetry(() =>
      db!.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt))
    );
    return rows.map(rowToReview);
  }
  return readReviewsFile().sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export interface RatingSummary {
  average: number;
  count: number;
}

// Rangkuman rating per produk (hanya ulasan disetujui).
export async function getRatingSummary(
  productId: string
): Promise<RatingSummary> {
  const list = await getApprovedReviews(productId);
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((n, r) => n + r.rating, 0);
  return {
    average: Math.round((sum / list.length) * 10) / 10,
    count: list.length,
  };
}

// Rangkuman untuk banyak produk sekaligus (efisien untuk grid katalog).
export async function getRatingSummaries(): Promise<
  Record<string, RatingSummary>
> {
  const map: Record<string, { sum: number; count: number }> = {};
  for (const r of await readReviews()) {
    if (!r.approved) continue;
    map[r.product_id] ??= { sum: 0, count: 0 };
    map[r.product_id].sum += r.rating;
    map[r.product_id].count += 1;
  }
  const out: Record<string, RatingSummary> = {};
  for (const [id, v] of Object.entries(map)) {
    out[id] = {
      average: Math.round((v.sum / v.count) * 10) / 10,
      count: v.count,
    };
  }
  return out;
}

export async function addReview(input: {
  product_id: string;
  name: string;
  rating: number;
  comment: string;
}): Promise<{ ok: boolean; error?: string; review?: Review }> {
  const name = (input.name ?? "").toString().trim().slice(0, 60);
  const comment = (input.comment ?? "").toString().trim().slice(0, 1000);
  const rating = Math.round(Number(input.rating));

  if (!name) return { ok: false, error: "Nama wajib diisi." };
  if (!(rating >= 1 && rating <= 5))
    return { ok: false, error: "Rating harus 1–5 bintang." };
  if (comment.length < 3)
    return { ok: false, error: "Ulasan terlalu pendek." };

  // Penyaring spam: ulasan asli pelanggan tidak memuat tautan.
  if (/(https?:\/\/|www\.|\[url|<a\s)/i.test(`${name} ${comment}`))
    return { ok: false, error: "Ulasan tidak boleh memuat tautan." };

  // Tolak ulasan identik yang dikirim berulang untuk produk yang sama.
  const existing = await readReviews();
  const isDuplicate = existing.some(
    (r) =>
      r.product_id === input.product_id &&
      r.name.toLowerCase() === name.toLowerCase() &&
      r.comment.toLowerCase() === comment.toLowerCase()
  );
  if (isDuplicate)
    return { ok: false, error: "Ulasan serupa sudah pernah dikirim." };

  const review: Review = {
    id: globalThis.crypto?.randomUUID?.() ?? `rv-${Date.now()}`,
    product_id: input.product_id,
    name,
    rating,
    comment,
    approved: true, // tampil langsung; admin dapat menyembunyikan/hapus
    created_at: new Date().toISOString(),
  };

  if (db) {
    try {
      await requireDb().insert(reviewsTable).values({
        id: review.id,
        productId: review.product_id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        approved: review.approved,
      });
    } catch {
      // FK gagal → product_id tidak ada di tabel products.
      return { ok: false, error: "Produk tidak ditemukan." };
    }
    return { ok: true, review };
  }

  const list = readReviewsFile();
  list.push(review);
  writeReviewsFile(list);
  return { ok: true, review };
}

export async function setReviewApproved(
  id: string,
  approved: boolean
): Promise<boolean> {
  if (db) {
    const rows = await requireDb()
      .update(reviewsTable)
      .set({ approved })
      .where(eq(reviewsTable.id, id))
      .returning({ id: reviewsTable.id });
    return rows.length > 0;
  }

  const list = readReviewsFile();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], approved };
  writeReviewsFile(list);
  return true;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (db) {
    const rows = await requireDb()
      .delete(reviewsTable)
      .where(eq(reviewsTable.id, id))
      .returning({ id: reviewsTable.id });
    return rows.length > 0;
  }

  const list = readReviewsFile();
  const next = list.filter((r) => r.id !== id);
  if (next.length === list.length) return false;
  writeReviewsFile(next);
  return true;
}
