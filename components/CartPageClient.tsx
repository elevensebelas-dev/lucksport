"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { formatIDR } from "@/lib/products";
import { waCheckout } from "@/lib/whatsapp";
import { PROVINCES } from "@/lib/shipping";
import type { ShippingOption } from "@/lib/types";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CartIcon,
  WhatsAppIcon,
  TruckIcon,
  ChevronDown,
} from "@/components/Icons";

export default function CartPageClient() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();
  const { addOrder } = useOrders();
  const [note, setNote] = useState("");

  // Estimasi ongkir (Fase 3)
  const [province, setProvince] = useState("");
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selected, setSelected] = useState<ShippingOption | null>(null);
  const [shipLoading, setShipLoading] = useState(false);
  const [shipError, setShipError] = useState<string | null>(null);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const shippingCost = selected?.cost ?? 0;
  const total = subtotal + shippingCost;

  async function checkOngkir() {
    if (!province) {
      setShipError("Pilih provinsi tujuan dulu.");
      return;
    }
    setShipError(null);
    setShipLoading(true);
    setSelected(null);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ province, itemCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghitung ongkir.");
      setOptions(data.options);
    } catch (e) {
      setShipError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      setOptions([]);
    } finally {
      setShipLoading(false);
    }
  }

  const shippingForOrder = selected
    ? {
        province,
        courier: selected.courier,
        service: selected.service,
        cost: selected.cost,
      }
    : null;

  function recordOrder() {
    addOrder({ items, subtotal, note, shipping: shippingForOrder });
  }

  if (items.length === 0) {
    return (
      <div className="container-content flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <CartIcon width={40} height={40} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Keranjangmu kosong
        </h1>
        <p className="mt-2 text-slate-600">
          Yuk jelajahi katalog dan temukan gear favoritmu.
        </p>
        <Link href="/katalog" className="btn-primary mt-6">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-8 lg:py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Keranjang Belanja</h1>
      <p className="mt-1 text-slate-600">
        {items.reduce((n, i) => n + i.quantity, 0)} item dalam keranjang
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Tabel item */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <ul className="divide-y divide-slate-200">
              {items.map((item) => (
                <li
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-4"
                >
                  <Link
                    href={`/produk/${item.slug}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link
                          href={`/produk/${item.slug}`}
                          className="font-semibold text-slate-900 hover:text-brand-600"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-slate-500">
                          Ukuran: {item.size} · Warna: {item.color}
                        </p>
                        <p className="mt-1 text-sm font-medium text-brand-700">
                          {formatIDR(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id, item.size, item.color)}
                        className="self-start text-slate-400 hover:text-red-500"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <TrashIcon width={20} height={20} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-lg border border-slate-300">
                        <button
                          onClick={() =>
                            setQty(item.product_id, item.size, item.color, item.quantity - 1)
                          }
                          className="px-3 py-1.5 text-slate-600 hover:text-brand-600"
                          aria-label="Kurangi jumlah"
                        >
                          <MinusIcon width={16} height={16} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQty(item.product_id, item.size, item.color, item.quantity + 1)
                          }
                          className="px-3 py-1.5 text-slate-600 hover:text-brand-600"
                          aria-label="Tambah jumlah"
                        >
                          <PlusIcon width={16} height={16} />
                        </button>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link href="/katalog" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              ← Lanjutkan Belanja
            </Link>
            <button
              onClick={clear}
              className="text-sm font-medium text-slate-500 hover:text-red-500"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Ringkasan Pesanan</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ongkos kirim</span>
                <span className="font-medium text-slate-900">
                  {selected ? formatIDR(shippingCost) : "—"}
                </span>
              </div>
            </div>

            {/* Estimasi ongkir (Fase 3) */}
            <div className="my-4 rounded-lg border border-slate-200 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <TruckIcon width={16} height={16} /> Estimasi Ongkir
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setOptions([]);
                      setSelected(null);
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-brand-500 focus:outline-none"
                    aria-label="Provinsi tujuan"
                  >
                    <option value="">Pilih provinsi…</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <button
                  onClick={checkOngkir}
                  disabled={shipLoading}
                  className="btn-outline whitespace-nowrap px-3 py-2 text-sm"
                >
                  {shipLoading ? "…" : "Cek"}
                </button>
              </div>

              {shipError && (
                <p className="mt-2 text-xs text-red-600">{shipError}</p>
              )}

              {options.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {options.map((o, i) => {
                    const active =
                      selected?.courier === o.courier &&
                      selected?.service === o.service;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelected(o)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                          active
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>
                          <span className="font-medium text-slate-800">
                            {o.courier} {o.service}
                          </span>
                          <span className="block text-xs text-slate-400">
                            Estimasi {o.etd}
                          </span>
                        </span>
                        <span className="font-semibold text-brand-700">
                          {formatIDR(o.cost)}
                        </span>
                      </button>
                    );
                  })}
                  <p className="pt-1 text-[11px] text-slate-400">
                    Estimasi. Ongkir final dikonfirmasi CS saat checkout.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-4">
              <span className="text-base font-semibold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-slate-900">
                {formatIDR(total)}
              </span>
            </div>

            {/* Catatan pesanan (PRD 5.4.2) */}
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Catatan pesanan (opsional)
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Contoh: tolong dikirim sebelum akhir pekan"
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <a
              href={waCheckout(items, note, shippingForOrder)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={recordOrder}
              className="btn-whatsapp mt-4 w-full py-3.5 text-base"
            >
              <WhatsAppIcon width={20} height={20} />
              Checkout via WhatsApp
            </a>
            <p className="mt-2 text-center text-xs text-slate-500">
              Pesananmu akan dikirim sebagai ringkasan otomatis ke CS Lucksport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
