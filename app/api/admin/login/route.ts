import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE,
  getAdminPassword,
  isAuthConfigured,
  makeToken,
} from "@/lib/auth";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Maksimal 8 percobaan gagal per IP dalam 15 menit.
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

// POST /api/admin/login — verifikasi password & set cookie sesi.
export async function POST(request: Request) {
  // Fail closed: tolak login bila kredensial produksi belum dikonfigurasi,
  // agar password default tidak pernah berlaku di server publik.
  if (!isAuthConfigured()) {
    console.error(
      "Login admin ditolak: ADMIN_PASSWORD/AUTH_SECRET belum diset di produksi."
    );
    return NextResponse.json(
      { error: "Panel admin belum dikonfigurasi. Hubungi administrator." },
      { status: 503 }
    );
  }

  const key = `login:${clientIp(request)}`;
  const limited = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const password = (body.password ?? "").toString();
  if (!password || password !== getAdminPassword()) {
    // Sedikit jeda untuk memperlambat brute force.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  // Login berhasil — bebaskan kuota IP ini.
  resetRateLimit(key);

  const token = await makeToken();
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}
