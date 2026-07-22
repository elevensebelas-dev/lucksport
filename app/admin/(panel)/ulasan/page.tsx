import type { Metadata } from "next";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";
import { getAllReviews } from "@/lib/reviews";
import { readAll } from "@/lib/store";

export const metadata: Metadata = {
  title: "Moderasi Ulasan",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminUlasanPage() {
  const reviews = await getAllReviews();
  // Peta nama produk untuk ditampilkan di tabel.
  const names = Object.fromEntries(
    (await readAll()).map((p) => [p.product_id, p.name])
  );
  return <AdminReviewsClient initial={reviews} productNames={names} />;
}
