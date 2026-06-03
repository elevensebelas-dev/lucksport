import { NextResponse } from "next/server";
import { getAllRestock } from "@/lib/restock";

export const dynamic = "force-dynamic";

// GET /api/admin/restock — daftar permintaan (admin, dilindungi middleware).
export async function GET() {
  return NextResponse.json({ requests: getAllRestock() });
}
