import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getAllProductsAdmin,
  createProduct,
  validateInput,
} from "@/lib/store";

export const dynamic = "force-dynamic";

// GET /api/products — daftar semua produk (termasuk nonaktif) untuk admin.
export async function GET() {
  return NextResponse.json({ products: await getAllProductsAdmin() });
}

// POST /api/products — tambah produk baru.
export async function POST(request: Request) {
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

  const product = await createProduct(result.value);

  // Segarkan storefront agar produk baru langsung tampil.
  revalidatePath("/", "layout");

  return NextResponse.json({ product }, { status: 201 });
}
