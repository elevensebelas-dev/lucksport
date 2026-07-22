import { NextResponse } from "next/server";
import { addRestock } from "@/lib/restock";

export const dynamic = "force-dynamic";

// POST /api/restock — daftar permintaan notifikasi stok kembali (publik).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const result = await addRestock({
    product_id: String(body.product_id ?? ""),
    product_name: String(body.product_name ?? ""),
    contact: String(body.contact ?? ""),
  });

  if (!result.ok)
    return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true }, { status: 201 });
}
