"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatIDR, totalStock, stockStatus } from "@/lib/products";
import type { Product } from "@/lib/types";
import AdminProductForm from "./AdminProductForm";
import { PlusIcon, TrashIcon, CloseIcon } from "@/components/Icons";

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; product: Product };

export default function AdminClient({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [view, setView] = useState<View>({ mode: "list" });
  const [busyId, setBusyId] = useState<string | null>(null);

  function upsert(p: Product) {
    setProducts((list) => {
      const idx = list.findIndex((x) => x.product_id === p.product_id);
      if (idx === -1) return [p, ...list];
      const next = list.slice();
      next[idx] = p;
      return next;
    });
    setView({ mode: "list" });
  }

  async function toggleActive(p: Product) {
    setBusyId(p.product_id);
    try {
      const res = await fetch(`/api/products/${p.product_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((list) =>
          list.map((x) => (x.product_id === p.product_id ? data.product : x))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Hapus produk "${p.name}"? Tindakan ini tidak bisa dibatalkan.`))
      return;
    setBusyId(p.product_id);
    try {
      const res = await fetch(`/api/products/${p.product_id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((list) => list.filter((x) => x.product_id !== p.product_id));
      }
    } finally {
      setBusyId(null);
    }
  }

  // ── Form (tambah / edit) ──
  if (view.mode !== "list") {
    const editing = view.mode === "edit" ? view.product : undefined;
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {editing ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            onClick={() => setView({ mode: "list" })}
            className="text-slate-500 hover:text-slate-800"
            aria-label="Tutup"
          >
            <CloseIcon />
          </button>
        </div>
        <AdminProductForm
          initial={editing}
          onSaved={upsert}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  // ── Daftar produk ──
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Daftar Produk ({products.length})
          </h2>
          <p className="text-sm text-slate-500">
            Kelola katalog Lucksport — tambah, edit, atau nonaktifkan produk.
          </p>
        </div>
        <button onClick={() => setView({ mode: "new" })} className="btn-primary">
          <PlusIcon width={18} height={18} /> Tambah Produk
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-slate-600">Belum ada produk.</p>
          <button onClick={() => setView({ mode: "new" })} className="btn-primary mt-4">
            <PlusIcon width={18} height={18} /> Tambah Produk Pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const stock = totalStock(p);
                const status = stockStatus(stock);
                return (
                  <tr key={p.product_id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {p.images[0] && (
                            <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/produk/${p.slug}`}
                            target="_blank"
                            className="font-medium text-slate-900 hover:text-brand-600"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {p.variants.length} varian · {p.images.length} foto
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">
                        {formatIDR(p.price)}
                      </span>
                      {p.price_original && (
                        <span className="ml-1 text-xs text-slate-400 line-through">
                          {formatIDR(p.price_original)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          status === "Tersedia"
                            ? "text-green-600"
                            : status === "Stok Terbatas"
                            ? "text-accent-600"
                            : "text-red-500"
                        }
                      >
                        {stock} · {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={busyId === p.product_id}
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {p.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setView({ mode: "edit", product: p })}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(p)}
                          disabled={busyId === p.product_id}
                          className="rounded-lg border border-red-200 px-2 py-1.5 text-red-500 hover:bg-red-50"
                          aria-label={`Hapus ${p.name}`}
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
