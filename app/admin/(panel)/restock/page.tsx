import type { Metadata } from "next";
import AdminRestockClient from "@/components/admin/AdminRestockClient";
import { getAllRestock } from "@/lib/restock";

export const metadata: Metadata = {
  title: "Permintaan Notif Stok",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRestockPage() {
  return <AdminRestockClient initial={getAllRestock()} />;
}
