import type { MetadataRoute } from "next";
import { readAll } from "@/lib/store";
import { STORE } from "@/lib/config";
import { CATEGORY_CONTENT } from "@/lib/categories";

// Dibuat saat diminta, bukan saat build: daftar produk ada di database, jadi
// build tidak boleh bergantung pada koneksi DB — sekaligus membuat produk baru
// langsung masuk sitemap tanpa perlu rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${STORE.domain}`;
  const staticRoutes = [
    "",
    "/katalog",
    "/promo",
    "/tentang-kami",
    "/faq",
    "/kebijakan",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Halaman kategori — prioritas tinggi: inilah pintu masuk pencarian
  // seperti "jual kayak" atau "jual perahu karet".
  const categoryRoutes = CATEGORY_CONTENT.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const productRoutes = (await readAll()).map((p) => ({
    url: `${base}/produk/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
