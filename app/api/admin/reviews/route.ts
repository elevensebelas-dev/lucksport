import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// GET /api/admin/reviews — semua ulasan (admin, dilindungi middleware).
export async function GET() {
  return NextResponse.json({ reviews: await getAllReviews() });
}
