import type { Metadata } from "next";
import CartPageClient from "@/components/CartPageClient";

export const metadata: Metadata = {
  title: "Keranjang Belanja",
  description: "Tinjau pesananmu dan checkout cepat via WhatsApp.",
};

export default function KeranjangPage() {
  return <CartPageClient />;
}
