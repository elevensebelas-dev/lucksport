import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import ReviewSection from "@/components/ReviewSection";
import T from "@/components/T";
import { formatIDR, totalStock } from "@/lib/products";
import { getProductBySlug, getRelatedProducts } from "@/lib/store";
import {
  getApprovedReviews,
  getRatingSummary,
  getRatingSummaries,
} from "@/lib/reviews";
import { STORE } from "@/lib/config";

// Dirender saat diminta (SSR), bukan saat build — dan sengaja TANPA
// generateStaticParams: katalog ada di database, jadi membacanya saat build
// membuat build bergantung pada koneksi DB (build Vercel pernah gagal dengan
// "statement timeout"), dan produk baru dari admin tak akan tampil sampai
// rebuild. SSR tetap ramah SEO — HTML penuh dikirim ke crawler.
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: `${product.name} — ${formatIDR(product.price)}. ${product.description.slice(0, 140)}`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const base = `https://${STORE.domain}`;
  const inStock = totalStock(product) > 0;

  // Query dijalankan paralel, bukan berurutan: database berada di region lain,
  // sehingga tiap round-trip mahal. Sebelumnya 5 query berurutan (~2 detik).
  const [related, reviews, summaries] = await Promise.all([
    getRelatedProducts(product, 4),
    getApprovedReviews(product.product_id),
    getRatingSummaries(),
  ]);

  // Rangkuman rating dihitung dari `reviews` yang sudah diambil — memanggil
  // getRatingSummary() akan mengulang query yang sama persis.
  const summary = {
    average: reviews.length
      ? Math.round(
          (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0,
    count: reviews.length,
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    brand: { "@type": "Brand", name: STORE.name },
    ...(summary.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: summary.average,
        reviewCount: summary.count,
      },
    }),
    offers: {
      "@type": "Offer",
      url: `${base}/produk/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: STORE.name },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `${base}/katalog?kategori=${product.category.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${base}/produk/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <ProductDetail product={product} rating={summary} />

      <ReviewSection
        productId={product.product_id}
        initialReviews={reviews}
        initialAverage={summary.average}
      />

      {related.length > 0 && (
        <section className="container-content py-12">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900">
            <T k="pd.relatedTitle" />
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.product_id}
                product={p}
                rating={summaries[p.product_id]}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
