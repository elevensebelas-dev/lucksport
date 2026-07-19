// Rate limit sederhana berbasis memori (sliding window per-IP).
//
// Catatan penting: di serverless (Vercel) memori tidak dibagi antar instance
// dan hilang saat instance didaur ulang, jadi ini BUKAN penghalang mutlak —
// tujuannya meredam brute force & banjir spam dari satu sumber. Bila trafik
// sudah besar, pindahkan penghitung ini ke Redis/Upstash.

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

// Batasi ukuran peta agar tidak tumbuh tanpa henti pada instance berumur panjang.
const MAX_KEYS = 5000;

/** Ambil IP klien dari header proxy (Vercel) dengan fallback aman. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Catat satu percobaan. Mengembalikan { ok } — false bila kuota terlampaui.
 * @param key    pengenal unik (mis. `login:1.2.3.4`)
 * @param limit  jumlah percobaan yang diizinkan per jendela
 * @param windowMs panjang jendela dalam milidetik
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Bersihkan entri kedaluwarsa saat peta membesar.
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  const hit = buckets.get(key);
  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, retryAfter: Math.ceil((hit.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Hapus penghitung (mis. setelah login berhasil). */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
