"use client";

import Image from "next/image";
import Link from "next/link";
import { useOrders } from "@/context/OrdersContext";
import { formatIDR } from "@/lib/products";
import { waCheckout } from "@/lib/whatsapp";
import { CartIcon, WhatsAppIcon } from "@/components/Icons";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersClient() {
  const { orders, count, clear } = useOrders();

  if (count === 0) {
    return (
      <div className="container-content flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <CartIcon width={40} height={40} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Belum ada pesanan
        </h1>
        <p className="mt-2 max-w-md text-slate-600">
          Riwayat pesananmu akan muncul di sini setiap kali kamu checkout via
          WhatsApp.
        </p>
        <Link href="/katalog" className="btn-primary mt-6">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-8 lg:py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Riwayat Pesanan
          </h1>
          <p className="mt-1 text-slate-600">{count} pesanan</p>
        </div>
        <button
          onClick={clear}
          className="text-sm font-medium text-slate-500 hover:text-red-500"
        >
          Hapus Riwayat
        </button>
      </div>

      <div className="mb-6 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800">
        Riwayat ini tersimpan di perangkatmu. Status & pembayaran tiap pesanan
        dikonfirmasi oleh CS melalui WhatsApp.
      </div>

      <div className="space-y-5">
        {orders.map((order) => {
          const itemTotal = order.items.reduce(
            (n, i) => n + i.quantity,
            0
          );
          const grandTotal =
            order.subtotal + (order.shipping?.cost ?? 0);
          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Pesanan #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDateTime(order.created_at)} · {itemTotal} item
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  Menunggu konfirmasi
                </span>
              </div>

              <ul className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/produk/${item.slug}`}
                        className="text-sm font-medium text-slate-900 hover:text-brand-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {item.size} · {item.color} · {item.quantity}x
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {formatIDR(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-1 border-t border-slate-100 px-4 py-3 text-sm">
                {order.shipping && (
                  <div className="flex justify-between text-slate-500">
                    <span>
                      Ongkir · {order.shipping.courier} {order.shipping.service} (
                      {order.shipping.province})
                    </span>
                    <span>{formatIDR(order.shipping.cost)}</span>
                  </div>
                )}
                {order.note && (
                  <p className="text-xs text-slate-500">Catatan: {order.note}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-slate-900">
                    {formatIDR(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 px-4 py-3">
                <a
                  href={waCheckout(
                    order.items,
                    order.note,
                    order.shipping ?? null
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full text-sm"
                >
                  <WhatsAppIcon width={18} height={18} />
                  Lanjutkan / Tanya CS
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
