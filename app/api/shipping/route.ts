import { NextResponse } from "next/server";
import { estimateShipping, estimateWeightKg } from "@/lib/shipping";

export const dynamic = "force-dynamic";

// POST /api/shipping — estimasi ongkir (publik).
// Body: { province: string, itemCount: number }
export async function POST(request: Request) {
  let body: { province?: string; itemCount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const province = (body.province ?? "").toString();
  if (!province)
    return NextResponse.json({ error: "Pilih provinsi tujuan." }, { status: 400 });

  const weightKg = estimateWeightKg(Number(body.itemCount) || 1);
  const { source, options } = await estimateShipping(province, weightKg);

  if (options.length === 0)
    return NextResponse.json(
      { error: "Wilayah belum didukung estimasi otomatis." },
      { status: 400 }
    );

  return NextResponse.json({ source, weightKg, options });
}
