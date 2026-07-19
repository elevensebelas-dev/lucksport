// Server-only store untuk ulasan & rating produk (PRD §9 Fase 3).
// Penyimpanan berbasis file (data/reviews.json) — sama seperti store produk.
import fs from "fs";
import path from "path";
import type { Review } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "reviews.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readReviews(): Review[] {
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

function writeReviews(list: Review[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// Ulasan yang tampil di storefront (sudah disetujui), terbaru dulu.
export function getApprovedReviews(productId: string): Review[] {
  return readReviews()
    .filter((r) => r.product_id === productId && r.approved)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function getAllReviews(): Review[] {
  return readReviews().sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export interface RatingSummary {
  average: number;
  count: number;
}

// Rangkuman rating per produk (hanya ulasan disetujui).
export function getRatingSummary(productId: string): RatingSummary {
  const list = readReviews().filter(
    (r) => r.product_id === productId && r.approved
  );
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((n, r) => n + r.rating, 0);
  return {
    average: Math.round((sum / list.length) * 10) / 10,
    count: list.length,
  };
}

// Rangkuman untuk banyak produk sekaligus (efisien untuk grid katalog).
export function getRatingSummaries(): Record<string, RatingSummary> {
  const map: Record<string, { sum: number; count: number }> = {};
  for (const r of readReviews()) {
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

export function addReview(input: {
  product_id: string;
  name: string;
  rating: number;
  comment: string;
}): { ok: boolean; error?: string; review?: Review } {
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
  const existing = readReviews();
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
  existing.push(review);
  writeReviews(existing);
  return { ok: true, review };
}

export function setReviewApproved(id: string, approved: boolean): boolean {
  const list = readReviews();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], approved };
  writeReviews(list);
  return true;
}

export function deleteReview(id: string): boolean {
  const list = readReviews();
  const next = list.filter((r) => r.id !== id);
  if (next.length === list.length) return false;
  writeReviews(next);
  return true;
}
