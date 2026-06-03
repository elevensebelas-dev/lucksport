import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { setReviewApproved, deleteReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/reviews/:id — setujui / sembunyikan ulasan.
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: { approved?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    /* abaikan */
  }
  const ok = setReviewApproved(id, body.approved !== false);
  if (!ok)
    return NextResponse.json({ error: "Ulasan tidak ditemukan." }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/reviews/:id — hapus ulasan.
export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = deleteReview(id);
  if (!ok)
    return NextResponse.json({ error: "Ulasan tidak ditemukan." }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
