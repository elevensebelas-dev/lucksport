"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Order } from "@/lib/types";

const STORAGE_KEY = "lucksport_orders";

interface OrdersContextValue {
  orders: Order[];
  count: number;
  addOrder: (input: {
    items: CartItem[];
    subtotal: number;
    note?: string;
    shipping?: Order["shipping"];
  }) => Order;
  clear: () => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

// Riwayat pesanan disimpan lokal (PRD §9). Pembayaran/konfirmasi tetap via WA,
// sehingga ini berfungsi sebagai catatan pesanan di sisi pelanggan.
export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) setOrders(list);
      }
    } catch {
      /* abaikan */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* abaikan */
    }
  }, [orders, hydrated]);

  const value: OrdersContextValue = {
    orders,
    count: orders.length,
    addOrder: ({ items, subtotal, note, shipping }) => {
      const order: Order = {
        id:
          globalThis.crypto?.randomUUID?.() ??
          `ord-${Date.now()}`,
        created_at: new Date().toISOString(),
        items,
        subtotal,
        note,
        shipping: shipping ?? null,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    clear: () => setOrders([]),
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders harus dipakai di dalam OrdersProvider");
  return ctx;
}
