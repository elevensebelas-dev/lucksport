import type { Metadata } from "next";
import FaqClient from "@/components/FaqClient";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan Umum / Frequently Asked Questions",
  description:
    "Cara pemesanan, pembayaran, pengiriman, garansi, dan spesifikasi produk Luck Sport. Ordering, payment, shipping, warranty, and product specs.",
};

export default function FAQPage() {
  return <FaqClient />;
}
