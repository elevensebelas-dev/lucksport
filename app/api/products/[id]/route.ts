import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  updateProduct,
  deleteProduct,
  setActive,
  validateInput,
  getProductById,
} from "@/lib/store";

export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

// PUT /api/products/:id — edit produk.
export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const result = validateInput(body as Record<string, unknown>);
  if (!result.ok || !result.value) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const product = await updateProduct(id, result.value);
  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ product });
}

// PATCH /api/products/:id — toggle aktif/nonaktif.
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  if (!(await getProductById(id))) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }
  let body: { is_active?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    /* abaikan */
  }
  const product = await setActive(id, body.is_active !== false);
  revalidatePath("/", "layout");
  return NextResponse.json({ product });
}

// DELETE /api/products/:id — hapus produk.
export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
