import type { Metadata } from "next";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";
import { getAllReviews } from "@/lib/reviews";
import { readAll } from "@/lib/store";

export const metadata: Metadata = {
  title: "Moderasi Ulasan",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminUlasanPage() {
  const reviews = getAllReviews();
  // Peta nama produk untuk ditampilkan di tabel.
  const names = Object.fromEntries(
    readAll().map((p) => [p.product_id, p.name])
  );
  return <AdminReviewsClient initial={reviews} productNames={names} />;
}
