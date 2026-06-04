"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  formatIDR,
  stockStatus,
  totalStock,
  isCallForPrice,
} from "@/lib/products";
import { waInquiry } from "@/lib/whatsapp";
import { blurDataURL } from "@/lib/image";
import type { Product } from "@/lib/types";
import Badge, { discountPercent } from "./Badge";
import { RatingDisplay } from "./RatingStars";
import { CartIcon, HeartIcon, HeartFilledIcon, WhatsAppIcon } from "./Icons";

export default function ProductCard({
  product,
  rating,
}: {
  product: Product;
  rating?: { average: number; count: number };
}) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.product_id);
  const stock = totalStock(product);
  const status = stockStatus(stock);
  const soldOut = status === "Habis";
  const callCS = isCallForPrice(product);
  const hasDiscount =
    !callCS &&
    product.price_original != null &&
    product.price_original > product.price;

  // Tambah cepat: pilih varian pertama yang masih ada stok.
  function quickAdd() {
    const v =
      product.variants.find((x) => x.stock > 0) ?? product.variants[0];
    addItem({
      product_id: product.product_id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: v.size,
      color: v.color,
      quantity: 1,
    });
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      {/* Foto besar — fokus visual (PRD 5.2.1) */}
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <Badge key={b} type={b} />
          ))}
          {hasDiscount && (
            <span className="badge bg-red-500 text-white">
              -{discountPercent(product.price, product.price_original!)}%
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.product_id);
          }}
          aria-label={wished ? "Hapus dari favorit" : "Tambah ke favorit"}
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
        >
          {wished ? (
            <HeartFilledIcon width={18} height={18} className="text-red-500" />
          ) : (
            <HeartIcon width={18} height={18} className="text-slate-600" />
          )}
        </button>

        {!callCS && soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-slate-900/80 px-4 py-1.5 text-sm font-bold text-white">
              Stok Habis
            </span>
          </div>
        )}

        {/* Hover CTA (PRD 5.2.1) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="pointer-events-auto block rounded-lg bg-white/95 py-2 text-center text-sm font-semibold text-brand-700 shadow">
            Lihat Detail
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {product.category}
        </p>
        <Link href={`/produk/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 font-semibold text-slate-900 hover:text-brand-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          {callCS ? (
            <span className="text-base font-bold text-brand-700">
              Hubungi CS untuk harga
            </span>
          ) : (
            <>
              <span className="text-lg font-bold text-brand-700">
                {formatIDR(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">
                  {formatIDR(product.price_original!)}
                </span>
              )}
            </>
          )}
        </div>

        {rating && rating.count > 0 && (
          <div className="mt-1.5">
            <RatingDisplay value={rating.average} count={rating.count} size={14} />
          </div>
        )}

        {!callCS && (
          <p
            className={`mt-1 text-xs font-medium ${
              status === "Tersedia"
                ? "text-green-600"
                : status === "Stok Terbatas"
                ? "text-accent-600"
                : "text-red-500"
            }`}
          >
            {status}
          </p>
        )}

        <div className="mt-auto pt-3">
          {callCS ? (
            <a
              href={waInquiry(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full text-sm"
            >
              <WhatsAppIcon width={18} height={18} />
              Call CS
            </a>
          ) : (
            <button
              onClick={quickAdd}
              disabled={soldOut}
              className="btn-primary w-full text-sm"
            >
              <CartIcon width={18} height={18} />
              {soldOut ? "Stok Habis" : "Tambah ke Keranjang"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
