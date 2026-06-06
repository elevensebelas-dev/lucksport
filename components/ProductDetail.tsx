"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLang } from "@/context/LanguageContext";
import { formatIDR, stockStatus, isCallForPrice } from "@/lib/products";
import { blurDataURL } from "@/lib/image";
import { discountPercent } from "./Badge";
import Badge from "./Badge";
import { RatingDisplay } from "./RatingStars";
import RestockForm from "./RestockForm";
import { waBuyProduct, waNotifyStock, waInquiry } from "@/lib/whatsapp";
import {
  CartIcon,
  WhatsAppIcon,
  CheckIcon,
  ZoomIcon,
  CloseIcon,
  ChevronRight,
  HeartIcon,
  HeartFilledIcon,
} from "./Icons";
import type { Product } from "@/lib/types";

// Peta nama warna → kode hex untuk color swatch (PRD 5.3.2)
const COLOR_HEX: Record<string, string> = {
  Merah: "#dc2626",
  Biru: "#2563eb",
  Putih: "#f8fafc",
  Hitam: "#1e293b",
  Navy: "#1e3a5f",
  Hijau: "#16a34a",
  Oranye: "#ea580c",
  Abu: "#94a3b8",
};

export default function ProductDetail({
  product,
  rating,
}: {
  product: Product;
  rating?: { average: number; count: number };
}) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { t, lang } = useLang();
  const wished = has(product.product_id);

  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product]
  );
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size))),
    [product]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState<string | null>(
    sizes.length === 1 ? sizes[0] : null
  );
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasDiscount =
    product.price_original != null && product.price_original > product.price;

  // Stok untuk kombinasi ukuran + warna terpilih.
  function stockFor(s: string, c: string) {
    return product.variants.find((v) => v.size === s && v.color === c)?.stock ?? 0;
  }
  const selectedStock = size ? stockFor(size, color) : null;
  const selectedStatus = selectedStock != null ? stockStatus(selectedStock) : null;

  // Apakah ukuran tertentu tersedia pada warna terpilih.
  function sizeAvailable(s: string) {
    return stockFor(s, color) > 0;
  }

  const soldOut = product.variants.every((v) => v.stock === 0);
  const callCS = isCallForPrice(product);

  function handleAdd() {
    if (!size) {
      setError(t("pd.selectSize"));
      return;
    }
    if (stockFor(size, color) <= 0) {
      setError("Varian ini sedang habis.");
      return;
    }
    setError(null);
    addItem({
      product_id: product.product_id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size,
      color,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="container-content py-6 lg:py-10">
      {/* Breadcrumb (PRD 6.3) */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Beranda</Link>
        <ChevronRight width={14} height={14} />
        <Link
          href={`/katalog?kategori=${product.category.toLowerCase()}`}
          className="hover:text-brand-600"
        >
          {product.category}
        </Link>
        <ChevronRight width={14} height={14} />
        <span className="truncate font-medium text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ── Galeri foto (focal point, PRD 5.3.1) ── */}
        <div>
          <div
            className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={onMouseMove}
          >
            <Image
              src={product.images[activeImage]}
              alt={`${product.name} - foto ${activeImage + 1}`}
              fill
              priority
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-transform duration-200 ${
                zoom ? "scale-150" : "scale-100"
              }`}
              style={
                zoom
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />
            <span className="absolute right-3 top-3 hidden items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-600 lg:flex">
              <ZoomIcon width={14} height={14} /> Arahkan untuk zoom
            </span>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activeImage
                      ? "border-brand-600"
                      : "border-transparent hover:border-slate-300"
                  }`}
                  aria-label={`Lihat foto ${i + 1}`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Informasi produk ── */}
        <div>
          <div className="flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <Badge key={b} type={b} />
            ))}
          </div>

          <p className="mt-3 text-sm font-medium uppercase tracking-wide text-slate-400">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          {rating && rating.count > 0 && (
            <a href="#ulasan" className="mt-2 inline-flex items-center gap-1.5">
              <RatingDisplay value={rating.average} count={rating.count} />
              <span className="text-xs text-brand-600 hover:underline">
                Lihat ulasan
              </span>
            </a>
          )}

          {/* Harga */}
          {callCS ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5">
              <WhatsAppIcon width={20} height={20} className="text-whatsapp" />
              <span className="text-base font-bold text-brand-800">
                {t("pd.priceVia")}
              </span>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold text-brand-700">
                {formatIDR(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatIDR(product.price_original!)}
                  </span>
                  <span className="badge bg-red-500 text-white">
                    Hemat {discountPercent(product.price, product.price_original!)}%
                  </span>
                </>
              )}
            </div>
          )}

          <p className="mt-5 leading-relaxed text-slate-600">
            {lang === "en" && product.description_en
              ? product.description_en
              : product.description}
          </p>

          {/* Varian & stok hanya untuk produk berharga (bukan Call CS) */}
          {!callCS && (
          <>
          {/* Warna */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-900">
              {t("pd.color")}: <span className="font-normal text-slate-600">{color}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    // reset ukuran jika tidak tersedia di warna baru
                    if (size && stockFor(size, c) <= 0) setSize(null);
                  }}
                  title={c}
                  aria-label={`Warna ${c}`}
                  aria-pressed={color === c}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    color === c
                      ? "border-brand-600 ring-2 ring-brand-100"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: COLOR_HEX[c] ?? "#cbd5e1" }}
                >
                  {color === c && (
                    <CheckIcon
                      width={16}
                      height={16}
                      className={c === "Putih" ? "text-slate-700" : "text-white"}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ukuran */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{t("pd.size")}</p>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {t("pd.sizeGuide")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const avail = sizeAvailable(s);
                const selected = size === s;
                return (
                  <button
                    key={s}
                    onClick={() => avail && (setSize(s), setError(null))}
                    disabled={!avail}
                    aria-pressed={selected}
                    className={`min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-brand-600 bg-brand-600 text-white"
                        : avail
                        ? "border-slate-300 bg-white text-slate-800 hover:border-brand-500"
                        : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 line-through"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indikator stok */}
          {selectedStatus && (
            <p
              className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
                selectedStatus === "Tersedia"
                  ? "text-green-600"
                  : selectedStatus === "Stok Terbatas"
                  ? "text-accent-600"
                  : "text-red-500"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {selectedStatus === "Tersedia"
                ? t("status.available")
                : selectedStatus === "Stok Terbatas"
                ? t("status.limited")
                : t("status.out")}
              {selectedStatus === "Stok Terbatas" && selectedStock != null && (
                <span className="text-slate-500">({selectedStock})</span>
              )}
            </p>
          )}

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          </>
          )}

          {/* CTA */}
          {callCS ? (
            <a
              href={waInquiry(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-6 w-full py-3.5 text-base"
            >
              <WhatsAppIcon width={20} height={20} />
              {t("pd.callForInfo")}
            </a>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdd}
                disabled={soldOut}
                className="btn-primary flex-1 py-3.5 text-base"
              >
                {added ? (
                  <>
                    <CheckIcon width={20} height={20} /> {t("pd.added")}
                  </>
                ) : (
                  <>
                    <CartIcon width={20} height={20} />
                    {soldOut ? t("common.outOfStock") : t("common.addToCart")}
                  </>
                )}
              </button>
              <a
                href={
                  soldOut
                    ? waNotifyStock(product.name)
                    : waBuyProduct(product.name, size ?? sizes[0], color)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1 py-3.5 text-base"
              >
                <WhatsAppIcon width={20} height={20} />
                {soldOut ? t("pd.notifyStock") : t("pd.buyWa")}
              </a>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => toggle(product.product_id)}
            aria-pressed={wished}
            className={`mt-3 inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              wished ? "text-red-500" : "text-slate-600 hover:text-red-500"
            }`}
          >
            {wished ? (
              <HeartFilledIcon width={18} height={18} />
            ) : (
              <HeartIcon width={18} height={18} />
            )}
            {wished ? t("pd.savedFav") : t("pd.addToFav")}
          </button>

          {/* Notifikasi stok kembali saat habis */}
          {!callCS && soldOut && <RestockForm product={product} />}

          {/* Info ringkas */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <WhatsAppIcon width={16} height={16} className="text-whatsapp" />
              {t("pd.info.payment")}
            </p>
            <p className="mt-1.5 flex items-center gap-2">
              <CheckIcon width={16} height={16} className="text-brand-600" />
              {t("pd.info.hours")}
            </p>
          </div>
        </div>
      </div>

      {/* Modal panduan ukuran (PRD 5.3.2) */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Panduan Ukuran</h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Tutup"
                className="text-slate-500 hover:text-slate-800"
              >
                <CloseIcon />
              </button>
            </div>
            <SizeGuide category={product.category} />
            <p className="mt-4 text-xs text-slate-500">
              Ukuran dapat bervariasi ±1-2cm. Ragu memilih ukuran? Chat CS kami.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SizeGuide({ category }: { category: Product["category"] }) {
  if (category === "Sepatu") {
    const rows = [
      ["39", "24.5"],
      ["40", "25.0"],
      ["41", "26.0"],
      ["42", "26.5"],
      ["43", "27.5"],
      ["44", "28.0"],
    ];
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="py-2">Ukuran (EU)</th>
            <th className="py-2">Panjang Kaki (cm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([s, cm]) => (
            <tr key={s} className="border-b border-slate-100">
              <td className="py-2 font-medium text-slate-800">{s}</td>
              <td className="py-2 text-slate-600">{cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const rows = [
    ["S", "92-96", "66"],
    ["M", "97-101", "68"],
    ["L", "102-106", "70"],
    ["XL", "107-112", "72"],
    ["XXL", "113-118", "74"],
  ];
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-slate-500">
          <th className="py-2">Ukuran</th>
          <th className="py-2">Lingkar Dada (cm)</th>
          <th className="py-2">Panjang (cm)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([s, chest, len]) => (
          <tr key={s} className="border-b border-slate-100">
            <td className="py-2 font-medium text-slate-800">{s}</td>
            <td className="py-2 text-slate-600">{chest}</td>
            <td className="py-2 text-slate-600">{len}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
