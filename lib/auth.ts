// Autentikasi admin sederhana berbasis password tunggal (PRD §7.4).
// Token sesi = hash SHA-256 dari secret server, sehingga tidak dapat dipalsukan
// tanpa mengetahui AUTH_SECRET. Cocok untuk satu akun admin (tim Lucksport).
//
// Untuk produksi: set ADMIN_PASSWORD & AUTH_SECRET via environment variable.
// Modul ini edge-compatible (dipakai middleware) — hanya memakai Web Crypto.

export const COOKIE_NAME = "lucksport_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "lucksport123";
}

function getSecret(): string {
  return process.env.AUTH_SECRET || "lucksport-dev-secret-ganti-saat-produksi";
}

// Token deterministik dari secret — sama selama secret tidak berubah.
export async function makeToken(): Promise<string> {
  const data = new TextEncoder().encode(`admin|${getSecret()}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidToken(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await makeToken();
  // Perbandingan panjang-tetap untuk mengurangi timing attack.
  if (value.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < value.length; i++) {
    diff |= value.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
