import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, isValidToken } from "./lib/auth";

// Lindungi panel admin (/admin) dan API mutasi produk/upload.
// Pengunjung yang belum login diarahkan ke /admin/login; permintaan API
// yang tidak terautentikasi mendapat 401.
// Endpoint /api/admin/* yang tetap publik (untuk login itu sendiri).
const PUBLIC_ADMIN_API = ["/api/admin/login", "/api/admin/logout"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
    // Sudah login → langsung ke dashboard.
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products",
    "/api/products/:path*",
    "/api/upload",
    "/api/admin/:path*",
  ],
};
