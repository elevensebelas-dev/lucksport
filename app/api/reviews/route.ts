import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addReview, getApprovedReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// GET /api/reviews?product_id=... — ulasan disetujui (publik).
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("product_id");
  if (!id) return NextResponse.json({ reviews: [] });
  return NextResponse.json({ reviews: getApprovedReviews(id) });
}

// POST /api/reviews — kirim ulasan (publik).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
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
