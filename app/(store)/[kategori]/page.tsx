// Halaman kategori: /kayak, /kano, /perahu-karet, /sup
//
// Menangkap pencarian bertarget ("jual kayak", "harga kano fiberglass") yang
// tidak tertangkap /katalog?kategori=… — parameter query lemah untuk SEO dan
// tidak punya konten khas per kategori. Tiap halaman punya H1, paragraf, dan
// FAQ sendiri, plus JSON-LD FAQPage & Breadcrumb agar layak rich result.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import CategoryCta from "@/components/CategoryCta";
import LangText from "@/components/LangText";
import { getProductsByCategory } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";
import { findCategoryContent } from "@/lib/categories";
import { SITE_URL, STORE } from "@/lib/config";

// Data kategori ada di database → jangan disentuh saat build.
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ kategori: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { kategori } = await params;
  const content = findCategoryContent(kategori);
  if (!content) return { title: "Halaman tidak ditemukan" };

  // Metadata memakai bahasa Indonesia sebagai kanonik (pasar utama), dengan
  // alternate untuk pembaca Inggris.
  return {
    // `absolute` agar template layout ("%s | Lucksport") tidak menambah merek
    // untuk kedua kalinya — judul di sini sudah memuatnya, dan judul terlalu
    // panjang akan terpotong di hasil pencarian.
    title: { absolute: content.metaTitle.id },
    description: content.metaDescription.id,
    alternates: { canonical: `/${content.slug}` },
    openGraph: {
      title: content.metaTitle.id,
      description: content.metaDescription.id,
      url: `/${content.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { kategori } = await params;
  const content = findCategoryContent(kategori);
  // Hanya 4 slug kategori yang sah; sisanya 404 seperti biasa.
  if (!content) notFound();

  const [products, summaries] = await Promise.all([
    getProductsByCategory(content.category),
    getRatingSummaries(),
  ]);

  const url = `${SITE_URL}/${content.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: content.category, item: url },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.id.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: content.metaTitle.id,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/produk/${p.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      {products.length > 0 && <JsonLd data={listLd} />}

      <div className="container-content py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600">
            <LangText id="Beranda" en="Home" />
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-700">{content.category}</span>
        </nav>

        {/* Hero teks — H1 memuat kata kunci pencarian */}
        <header className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
            {STORE.city} · {STORE.region}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            <LangText id={content.h1.id} en={content.h1.en} />
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            <LangText id={content.intro.id} en={content.intro.en} />
          </p>
        </header>

        {/* Keunggulan */}
        <section className="mt-10 rounded-2xl bg-slate-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">
            <LangText id="Mengapa memilih Luck Sport" en="Why choose Luck Sport" />
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                id: "Dibuat dan diuji langsung di Danau Jatiluhur, Purwakarta",
                en: "Built and tested on Lake Jatiluhur, Purwakarta",
              },
              {
                id: "Dikerjakan tangan perajin Indonesia, bukan barang impor massal",
                en: "Handcrafted by Indonesian artisans, not mass-produced imports",
              },
              {
                id: "Spesifikasi bisa disesuaikan — ukuran, warna, dan material",
                en: "Customisable specs — size, colour, and material",
              },
              {
                id: "Konsultasi langsung dengan pembuatnya via WhatsApp",
                en: "Talk directly to the maker via WhatsApp",
              },
            ].map((item) => (
              <li key={item.id} className="flex gap-3 text-sm text-slate-700">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
                />
                <LangText id={item.id} en={item.en} />
              </li>
            ))}
          </ul>
        </section>

        {/* Produk kategori ini */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900">
            <LangText
              id={`Pilihan ${content.category} Luck Sport`}
              en={`Luck Sport ${content.category} Range`}
            />
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.product_id}
                  product={p}
                  rating={summaries[p.product_id]}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-6 text-slate-600">
              <LangText
                id="Produk kategori ini sedang disiapkan. Hubungi kami untuk pemesanan khusus."
                en="Products in this category are being prepared. Contact us for custom orders."
              />
            </p>
          )}

          <Link
            href="/katalog"
            className="mt-6 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <LangText id="Lihat semua produk →" en="See all products →" />
          </Link>
        </section>

        {/* FAQ — sumber JSON-LD FAQPage di atas */}
        <section className="mt-14 max-w-3xl">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900">
            <LangText
              id="Pertanyaan yang sering diajukan"
              en="Frequently asked questions"
            />
          </h2>
          <div className="space-y-4">
            {content.faq.id.map((f, i) => (
              <details
                key={f.q}
                className="group rounded-xl border border-slate-200 p-5 open:bg-slate-50"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
                  <LangText id={f.q} en={content.faq.en[i]?.q ?? f.q} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  <LangText id={f.a} en={content.faq.en[i]?.a ?? f.a} />
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA WhatsApp */}
        <CategoryCta category={content.category} />
      </div>
    </>
  );
}
