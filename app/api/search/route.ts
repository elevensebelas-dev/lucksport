import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

// GET /api/search?q=... — saran produk untuk autocomplete (publik).
export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "")
    .trim()
    .toLowerCase();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = getActiveProducts()
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.images[0],
    }));

  return NextResponse.json({ results });
}
