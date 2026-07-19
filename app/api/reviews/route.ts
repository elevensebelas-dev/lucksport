import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addReview, getApprovedReviews } from "@/lib/reviews";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Maksimal 5 ulasan per IP dalam 1 jam.
const MAX_REVIEWS = 5;
const WINDOW_MS = 60 * 60 * 1000;

// GET /api/reviews?product_id=... — ulasan disetujui (publik).
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("product_id");
  if (!id) return NextResponse.json({ reviews: [] });
  return NextResponse.json({ reviews: getApprovedReviews(id) });
}

// POST /api/reviews — kirim ulasan (publik).
export async function POST(request: Request) {
  const limited = rateLimit(
    `review:${clientIp(request)}`,
    MAX_REVIEWS,
    WINDOW_MS
  );
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak ulasan dikirim. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  // Honeypot: field tersembunyi yang hanya diisi bot.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    // Balas 201 palsu agar bot tidak belajar bahwa dirinya terdeteksi.
    return NextResponse.json({ review: null }, { status: 201 });
  }

  const result = addReview({
    product_id: String(body.product_id ?? ""),
    name: String(body.name ?? ""),
    rating: Number(body.rating),
    comment: String(body.comment ?? ""),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ review: result.review }, { status: 201 });
}
