import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { getFeaturedProducts } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";
import { STORE } from "@/lib/config";
import { ChevronRight, TruckIcon, ShieldIcon, WhatsAppIcon, StarIcon } from "@/components/Icons";

export default function HomePage() {
  const featured = getFeaturedProducts(6);
  const summaries = getRatingSummaries();
  const base = `https://${STORE.domain}`;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STORE.name,
    url: base,
    description: `${STORE.tagline} — jersey, sepatu, celana & aksesori olahraga.`,
    sameAs: [STORE.instagramUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Indonesian",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STORE.name,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/katalog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <JsonLd data={websiteLd} />
      <HeroSlider />

      {/* Trust strip */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-content grid grid-cols-1 gap-4 py-6 sm:grid-cols-3">
          {[
            { icon: TruckIcon, title: "Pengiriman ke Seluruh Indonesia", desc: "Estimasi & ongkir dikonfirmasi via CS" },
            { icon: ShieldIcon, title: "Produk Original & Berkualitas", desc: "Foto produk nyata, stok jujur" },
            { icon: WhatsAppIcon, title: "Respons CS < 5 Menit", desc: "Senin–Sabtu, 08.00–21.00 WIB" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <f.icon width={22} height={22} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori unggulan */}
      <section className="container-content py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Belanja per Kategori
            </h2>
            <p className="mt-1 text-slate-600">
              Temukan perlengkapan sesuai kebutuhan olahragamu.
            </p>
          </div>
        </div>
        <CategoryGrid />
      </section>

      {/* Produk pilihan */}
      <section className="bg-slate-50 py-14">
        <div className="container-content">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Produk Pilihan
              </h2>
              <p className="mt-1 text-slate-600">
                Yang terbaru dan paling laris minggu ini.
              </p>
            </div>
            <Link
              href="/katalog"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex"
            >
              Lihat Semua <ChevronRight width={16} height={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard
                key={p.product_id}
                product={p}
                rating={summaries[p.product_id]}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/katalog" className="btn-outline">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="container-content py-16">
        <div className="relative overflow-hidden rounded-2xl bg-brand-700 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="relative mx-auto max-w-2xl">
            <StarIcon width={36} height={36} className="mx-auto text-accent-400" />
            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
              Punya pertanyaan sebelum membeli?
            </h2>
            <p className="mt-3 text-brand-100">
              Tim Customer Service kami siap membantu memilih ukuran, cek stok,
              dan order grosir untuk tim. Tinggal chat, beres!
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Lucksport%2C%20saya%20ingin%20bertanya%20tentang%20produk..."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-7 px-7 py-3.5 text-base"
            >
              <WhatsAppIcon width={20} height={20} />
              Chat CS Sekarang
            </a>
          </div>
          {/* dekorasi */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-600/50" />
          <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-brand-800/50" />
        </div>
      </section>
    </>
  );
}
