import type { Metadata } from "next";
import WishlistClient from "@/components/WishlistClient";
import { getActiveProducts } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Favorit Saya",
  description: "Produk Lucksport yang Anda simpan sebagai favorit.",
};

export default function WishlistPage() {
  return (
    <WishlistClient
      products={getActiveProducts()}
      summaries={getRatingSummaries()}
    />
  );
}
