// Autentikasi admin berbasis password tunggal (PRD §7.4).
//
// Token sesi = "<expiry>.<HMAC-SHA256(expiry, AUTH_SECRET)>" — bertanda tangan
// DAN punya masa berlaku, sehingga token yang bocor tidak berlaku selamanya.
//
// Di PRODUKSI, ADMIN_PASSWORD & AUTH_SECRET WAJIB diset: bila kosong, login
// ditolak total (fail closed) alih-alih diam-diam memakai nilai default yang
// bisa ditebak siapa pun.
//
// Modul ini edge-compatible (dipakai middleware) — hanya memakai Web Crypto.

export const COOKIE_NAME = "lucksport_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

const IS_PROD = process.env.NODE_ENV === "production";

// Nilai default HANYA untuk pengembangan lokal.
const DEV_PASSWORD = "lucksport123";
const DEV_SECRET = "lucksport-dev-secret-ganti-saat-produksi";

/** true bila konfigurasi kredensial layak dipakai di lingkungan saat ini. */
export function isAuthConfigured(): boolean {
  if (!IS_PROD) return true;
  const pw = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  return (
    !!pw &&
    pw !== DEV_PASSWORD &&
    !!secret &&
    secret !== DEV_SECRET &&
    secret.length >= 16
  );
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEV_PASSWORD;
}

function getSecret(): string {
  return process.env.AUTH_SECRET || DEV_SECRET;
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Bandingkan dua string dalam waktu tetap (mitigasi timing attack). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Terbitkan token sesi baru yang kedaluwarsa dalam SESSION_MAX_AGE. */
export async function makeToken(): Promise<string> {
  const expiry = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin|${expiry}`;
  return `${expiry}.${await hmac(payload)}`;
}

export async function isValidToken(value: string | undefined): Promise<boolean> {
  if (!value || !isAuthConfigured()) return false;

  const dot = value.indexOf(".");
  if (dot <= 0) return false;

  const expiryRaw = value.slice(0, dot);
  const sig = value.slice(dot + 1);

  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return false;

  return safeEqual(sig, await hmac(`admin|${expiryRaw}`));
}
