import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogClient from "@/components/CatalogClient";
import { getActiveProducts } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";

// Dirender saat diminta, bukan saat build: data katalog ada di database,
// sehingga build tidak boleh bergantung pada koneksi DB (build Vercel pernah
// gagal karena query saat build menggantung/timeout).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description:
    "Katalog lengkap Luck Sport: kayak, kano, perahu karet, dan papan SUP buatan tangan. Saring berdasarkan kategori dan ketersediaan.",
};

export default async function KatalogPage() {
  const products = await getActiveProducts();
  const summaries = await getRatingSummaries();
  return (
    <Suspense fallback={<div className="container-content py-20 text-center text-slate-500">Memuat katalog…</div>}>
      <CatalogClient products={products} summaries={summaries} />
    </Suspense>
  );
}
