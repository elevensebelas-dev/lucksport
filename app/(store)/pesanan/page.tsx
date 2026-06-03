import type { Metadata } from "next";
import OrdersClient from "@/components/OrdersClient";

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Daftar pesanan yang pernah kamu buat di Lucksport.",
};

export default function PesananPage() {
  return <OrdersClient />;
}
