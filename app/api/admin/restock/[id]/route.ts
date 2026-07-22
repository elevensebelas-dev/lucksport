import { NextResponse } from "next/server";
import { deleteRestock } from "@/lib/restock";

export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

// DELETE /api/admin/restock/:id — hapus permintaan.
export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteRestock(id);
  if (!ok)
    return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
