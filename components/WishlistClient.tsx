"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "./ProductCard";
import { HeartIcon } from "./Icons";
import type { Product } from "@/lib/types";

export default function WishlistClient({
  products,
  summaries = {},
}: {
  products: Product[];
  summaries?: Record<string, { average: number; count: number }>;
}) {
  const { ids, count, clear } = useWishlist();
  const items = products.filter((p) => ids.includes(p.product_id));

  if (count === 0) {
    return (
      <div className="container-content flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
          <HeartIcon width={40} height={40} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Belum ada favorit
        </h1>
        <p className="mt-2 max-w-md text-slate-600">
          Tap ikon hati pada produk untuk menyimpannya di sini dan mudah ditemukan
          nanti.
        </p>
        <Link href="/katalog" className="btn-primary mt-6">
          Jelajahi Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-8 lg:py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Favorit Saya</h1>
          <p className="mt-1 text-slate-600">{count} produk tersimpan</p>
        </div>
        <button
          onClick={clear}
          className="text-sm font-medium text-slate-500 hover:text-red-500"
        >
          Kosongkan
        </button>
      </div>

      {/* Catatan: produk favorit yang sudah nonaktif/dihapus tidak ditampilkan. */}
      {items.length < count && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Sebagian produk favorit Anda sudah tidak tersedia dan tidak ditampilkan.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard
            key={p.product_id}
            product={p}
            rating={summaries[p.product_id]}
          />
        ))}
      </div>
    </div>
  );
}
