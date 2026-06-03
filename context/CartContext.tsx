"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "lucksport_cart";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; product_id: string; size: string; color: string }
  | {
      type: "SET_QTY";
      product_id: string;
      size: string;
      color: string;
      quantity: number;
    }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

// SKU diidentifikasi oleh kombinasi produk + ukuran + warna.
function sameLine(
  a: CartItem,
  product_id: string,
  size: string,
  color: string
) {
  return a.product_id === product_id && a.size === size && a.color === color;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const existing = state.items.find((i) =>
        sameLine(i, action.item.product_id, action.item.size, action.item.color)
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "SET_QTY": {
      return {
        items: state.items.map((i) =>
          sameLine(i, action.product_id, action.size, action.color)
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i
        ),
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => !sameLine(i, action.product_id, action.size, action.color)
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size: string, color: string) => void;
  setQty: (
    product_id: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Muat keranjang dari localStorage saat mount (PRD Fase 1: cart local storage).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        if (Array.isArray(items)) dispatch({ type: "HYDRATE", items });
      }
    } catch {
      /* abaikan storage rusak */
    }
    setHydrated(true);
  }, []);

  // Simpan setiap perubahan.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* storage penuh / tidak tersedia */
    }
  }, [state.items, hydrated]);

  const count = state.items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = state.items.reduce((n, i) => n + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    count,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (item) => {
      dispatch({ type: "ADD", item });
      setIsOpen(true);
    },
    removeItem: (product_id, size, color) =>
      dispatch({ type: "REMOVE", product_id, size, color }),
    setQty: (product_id, size, color, quantity) =>
      dispatch({ type: "SET_QTY", product_id, size, color, quantity }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
