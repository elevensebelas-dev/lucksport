import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { FireIcon, WhatsAppIcon } from "@/components/Icons";
import { getActiveProducts } from "@/lib/store";
import { getRatingSummaries } from "@/lib/reviews";
import { discountPercent } from "@/components/Badge";
import { STORE } from "@/lib/config";

// Dirender saat diminta, bukan saat build: data katalog ada di database,
// sehingga build tidak boleh bergantung pada koneksi DB (build Vercel pernah
// gagal karena query saat build menggantung/timeout).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Promo & Diskon",
  description:
    "Penawaran spesial Lucksport — produk olahraga pilihan dengan harga diskon. Stok terbatas!",
};

export default async function PromoPage() {
  // Produk diskon, urut dari potongan terbesar.
  const active = await getActiveProducts();
  const onSale = active
    .filter((p) => p.price_original && p.price_original > p.price)
    .sort(
      (a, b) =>
        discountPercent(b.price, b.price_original!) -
        discountPercent(a.price, a.price_original!)
    );

  const bestSellers = active
    .filter((p) => p.badges.includes("best_seller"))
    .slice(0, 4);

  const summaries = await getRatingSummaries();

  return (
    <div>
      {/* Hero kampanye */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800">
        <div className="container-content relative py-16 text-center text-white sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wide">
            <FireIcon width={18} height={18} /> Penawaran Spesial
          </span>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
            Promo Gear Olahraga
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Hemat hingga{" "}
            {onSale.length
              ? Math.max(
                  ...onSale.map((p) => discountPercent(p.price, p.price_original!))
                )
              : 0}
            % untuk produk pilihan. Stok terbatas — buruan sebelum kehabisan!
          </p>
          <Link href="#produk-promo" className="btn-accent mt-7 px-7 py-3.5 text-base shadow-lg">
            Lihat Penawaran
          </Link>
        </div>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-black/10" />
      </section>

      {/* Produk diskon */}
      <section id="produk-promo" className="container-content py-14 scroll-mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Sedang Diskon
            </h2>
            <p className="mt-1 text-slate-600">
              {onSale.length} produk dengan harga spesial.
            </p>
          </div>
        </div>

        {onSale.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
            <p className="text-slate-600">
              Belum ada promo aktif saat ini. Pantau terus halaman ini, ya!
            </p>
            <Link href="/katalog" className="btn-primary mt-4">
              Lihat Semua Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {onSale.map((p) => (
              <ProductCard
                key={p.product_id}
                product={p}
                rating={summaries[p.product_id]}
              />
            ))}
          </div>
        )}
      </section>

      {/* Terlaris */}
      {bestSellers.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="container-content">
            <h2 className="mb-8 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Paling Laris
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {bestSellers.map((p) => (
                <ProductCard
                  key={p.product_id}
                  product={p}
                  rating={summaries[p.product_id]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-content py-16">
        <div className="rounded-2xl bg-brand-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Mau order grosir untuk tim?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Dapatkan harga khusus untuk pembelian jumlah banyak. Chat CS kami untuk
            penawaran terbaik.
          </p>
          <a
            href={`https://wa.me/${STORE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 px-7 py-3.5 text-base"
          >
            <WhatsAppIcon width={20} height={20} /> Chat CS
          </a>
        </div>
      </section>
    </div>
  );
}
