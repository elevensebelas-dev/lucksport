import type { Metadata } from "next";
import WishlistClient from "@/components/WishlistClient";
import { getActiveProducts } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";

// Dirender saat diminta, bukan saat build: data katalog ada di database,
// sehingga build tidak boleh bergantung pada koneksi DB (build Vercel pernah
// gagal karena query saat build menggantung/timeout).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Favorit Saya",
  description: "Produk Lucksport yang Anda simpan sebagai favorit.",
};

export default async function WishlistPage() {
  return (
    <WishlistClient
      products={await getActiveProducts()}
      summaries={await getRatingSummaries()}
    />
  );
}
