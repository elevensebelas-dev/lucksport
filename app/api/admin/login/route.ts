import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE,
  getAdminPassword,
  makeToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/admin/login — verifikasi password & set cookie sesi.
export async function POST(request: Request) {
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
