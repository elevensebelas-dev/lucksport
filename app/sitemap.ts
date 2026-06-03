import type { MetadataRoute } from "next";
import { readAll } from "@/lib/store";
import { STORE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const productRoutes = readAll().map((p) => ({
    url: `${base}/produk/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
