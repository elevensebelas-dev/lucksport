import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, isValidToken } from "./lib/auth";

// Lindungi panel admin (/admin) & API mutasi, sekaligus menentukan bahasa
// efektif visitor dan meneruskannya ke server (SSR) agar halaman ter-render
// langsung dalam bahasa yang benar — tanpa kedipan.
const PUBLIC_ADMIN_API = ["/api/admin/login", "/api/admin/logout"];

// Cookie bahasa (sumber kebenaran tunggal: pilihan manual ATAU deteksi geo).
const LANG_COOKIE = "lucksport_lang";
// Header internal untuk meneruskan bahasa ke Server Component (root layout).
const LANG_HEADER = "x-lucksport-lang";

function needsAdminGuard(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/admin")
  );
}

// Bahasa default dari negara visitor: Indonesia → "id", selain itu → "en".
// Tanpa data geo (mis. lokal/non-Vercel) tebak dari Accept-Language; default "id".
function detectLang(req: NextRequest): "id" | "en" {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    (req as unknown as { geo?: { country?: string } }).geo?.country ||
    "";

  if (country) return country.toUpperCase() === "ID" ? "id" : "en";

  const al = (req.headers.get("accept-language") || "").toLowerCase();
  if (!al) return "id";
  return /(^|[,;\s])id\b/.test(al) ? "id" : "en";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bahasa efektif: pilihan tersimpan (cookie) > deteksi negara.
  const saved = req.cookies.get(LANG_COOKIE)?.value;
  const lang: "id" | "en" =
    saved === "id" || saved === "en" ? saved : detectLang(req);

  // Teruskan bahasa ke Server Component lewat request header.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(LANG_HEADER, lang);
  const pass = () =>
    NextResponse.next({ request: { headers: requestHeaders } });

  // ── Proteksi admin (hanya untuk path admin/api) ──
  if (needsAdminGuard(pathname)) {
    const authed = await isValidToken(req.cookies.get(COOKIE_NAME)?.value);
    const isApi =
      pathname.startsWith("/api/products") ||
      pathname.startsWith("/api/upload") ||
      (pathname.startsWith("/api/admin") &&
        !PUBLIC_ADMIN_API.includes(pathname));
    const isLogin = pathname === "/admin/login";

    if (!authed) {
      if (isApi) {
        return NextResponse.json(
          { error: "Tidak terautentikasi. Silakan login sebagai admin." },
          { status: 401 }
        );
      }
      if (pathname.startsWith("/admin") && !isLogin) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    } else if (isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return pass();
  }

  // ── Halaman publik: render dengan bahasa benar; simpan cookie bila baru ──
  const res = pass();
  if (saved !== lang) {
    res.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: [
    // Semua halaman & rute API kecuali aset statis (punya ekstensi file),
    // _next, dan favicon.
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
