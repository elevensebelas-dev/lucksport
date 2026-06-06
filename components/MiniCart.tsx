"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useLang } from "@/context/LanguageContext";
import { formatIDR } from "@/lib/products";
import { waCheckout } from "@/lib/whatsapp";
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, CartIcon, WhatsAppIcon } from "./Icons";

export default function MiniCart() {
  const { items, isOpen, closeCart, subtotal, setQty, removeItem } = useCart();
  const { addOrder } = useOrders();
  const { t } = useLang();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      {/* Drawer dari kanan (PRD 5.4.1) */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Keranjang belanja"
        aria-modal={isOpen}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <CartIcon width={22} height={22} /> {t("cart.miniCart")}
          </h2>
          <button onClick={closeCart} aria-label="Tutup keranjang" className="text-slate-500 hover:text-slate-800">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <CartIcon width={32} height={32} />
            </div>
            <p className="text-slate-600">{t("cart.empty.title")}</p>
            <Link href="/katalog" onClick={closeCart} className="btn-primary">
              {t("cart.startShopping")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={`${item.product_id}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <Link
                      href={`/produk/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/produk/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-slate-900 hover:text-brand-600"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product_id, item.size, item.color)}
                          className="text-slate-400 hover:text-red-500"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <TrashIcon width={18} height={18} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        {item.size} · {item.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-lg border border-slate-300">
                          <button
                            onClick={() =>
                              setQty(item.product_id, item.size, item.color, item.quantity - 1)
                            }
                            className="px-2 py-1 text-slate-600 hover:text-brand-600"
                            aria-label="Kurangi jumlah"
                          >
                            <MinusIcon width={16} height={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQty(item.product_id, item.size, item.color, item.quantity + 1)
                            }
                            className="px-2 py-1 text-slate-600 hover:text-brand-600"
                            aria-label="Tambah jumlah"
                          >
                            <PlusIcon width={16} height={16} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {formatIDR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-slate-600">{t("cart.subtotal")}</span>
                <span className="text-xl font-bold text-slate-900">
                  {formatIDR(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t("cart.shipNote")}</p>
              <a
                href={waCheckout(items)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => addOrder({ items, subtotal })}
                className="btn-whatsapp mt-3 w-full"
              >
                <WhatsAppIcon width={20} height={20} />
                {t("cart.checkout")}
              </a>
              <div className="mt-2 flex gap-2">
                <Link href="/keranjang" onClick={closeCart} className="btn-outline flex-1 text-sm">
                  {t("cart.viewCart")}
                </Link>
                <button onClick={closeCart} className="btn-outline flex-1 text-sm">
                  {t("cart.continue")}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
