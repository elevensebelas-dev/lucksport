import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogClient from "@/components/CatalogClient";
import { getActiveProducts } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description:
    "Jelajahi katalog lengkap Lucksport: jersey, sepatu, celana, dan aksesori olahraga. Filter berdasarkan kategori, harga, dan ketersediaan.",
};

export default function KatalogPage() {
  const products = getActiveProducts();
  const summaries = getRatingSummaries();
  return (
    <Suspense fallback={<div className="container-content py-20 text-center text-slate-500">Memuat katalog…</div>}>
      <CatalogClient products={products} summaries={summaries} />
    </Suspense>
  );
}
