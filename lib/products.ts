import type { Product, Category } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Katalog awal (seed) Luck Sport Indonesia — produk olahraga air.
// Foto asli ada di public/gambar-ls/. Semua produk kategori "Perahu" memakai
// pola "Call CS" (harga menyesuaikan spesifikasi → hubungi CS).
//
// Sumber kebenaran runtime adalah data/products.json (lib/store.ts), yang
// di-seed dari array ini saat pertama kali dijalankan.
// ─────────────────────────────────────────────────────────────────────────

const VARIANT = [{ size: "Standar", color: "Default", stock: 1 }];

export const products: Product[] = [
  {
    product_id: "ls-boat-01",
    slug: "luck-sport-outrigger-canoe",
    name: "Luck Sport Outrigger Canoe",
    category: "Perahu",
    description:
      "Kano outrigger (bercadik) Luck Sport untuk dayung rekreasi maupun latihan. Stabil di air berkat penyeimbang samping. Hubungi CS untuk spesifikasi & harga.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-01.jpg"],
    variants: VARIANT,
    badges: ["new"],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-02",
    slug: "luck-sport-kayak-four-k4-carbon-fiber",
    name: "Luck Sport Kayak Four (K4) - Carbon Fiber",
    category: "Perahu",
    description:
      "Kayak balap empat pendayung (K4) berbahan serat karbon — ringan, kaku, dan cepat untuk nomor sprint. Hubungi CS untuk spesifikasi & harga.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-02.jpg", "/gambar-ls/ls-09.jpg"],
    variants: VARIANT,
    badges: [],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-03",
    slug: "luck-sport-canoe-single-c1-fiberglass",
    name: "Luck Sport Canoe Single (C1) - Fiberglass",
    category: "Perahu",
    description:
      "Kano balap satu pendayung (C1) berbahan fiberglass yang tangguh dan ekonomis. Cocok untuk latihan & kompetisi. Hubungi CS untuk detail.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-03.jpg"],
    variants: VARIANT,
    badges: [],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-04",
    slug: "luck-sport-kayak-slalom",
    name: "Luck Sport Kayak Slalom",
    category: "Perahu",
    description:
      "Kayak slalom Luck Sport — lincah dan responsif untuk arung jeram & lintasan slalom. Hubungi CS untuk spesifikasi & harga.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-04.jpg"],
    variants: VARIANT,
    badges: [],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-05",
    slug: "luck-sport-kayak-single-k1-carbon-fiber",
    name: "Luck Sport Kayak Single (K1) - Carbon Fiber",
    category: "Perahu",
    description:
      "Kayak balap satu pendayung (K1) serat karbon — ringan dan cepat untuk nomor sprint. Hubungi CS untuk spesifikasi & harga.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-05.jpg"],
    variants: VARIANT,
    badges: ["best_seller"],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-06",
    slug: "luck-sport-kayak-double-carbon-fiber",
    name: "Luck Sport Kayak Double - Carbon Fiber",
    category: "Perahu",
    description:
      "Kayak balap dua pendayung berbahan serat karbon, stabil dan bertenaga. Hubungi CS untuk spesifikasi & harga.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-06.jpg"],
    variants: VARIANT,
    badges: [],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-07",
    slug: "luck-sport-kayak-single-k1-fiberglass",
    name: "Luck Sport Kayak Single (K1) - Fiberglass",
    category: "Perahu",
    description:
      "Kayak satu pendayung (K1) berbahan fiberglass yang kuat dan ekonomis. Ideal untuk latihan. Hubungi CS untuk detail.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-07.jpg"],
    variants: VARIANT,
    badges: [],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-08",
    slug: "luck-sport-canoe-double-c2-carbon-fiber",
    name: "Luck Sport Canoe Double (C2) - Carbon Fiber",
    category: "Perahu",
    description:
      "Kano balap dua pendayung (C2) serat karbon untuk performa kompetisi. Hubungi CS untuk spesifikasi & harga.",
    price: 0,
    price_original: null,
    images: ["/gambar-ls/ls-08.jpg"],
    variants: VARIANT,
    badges: [],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
  {
    product_id: "ls-boat-09",
    slug: "luck-sport-lcr-inflatable-boat",
    name: "Luck Sport LCR Inflatable Boat",
    category: "Perahu",
    description:
      "Perahu karet LCR (inflatable boat) Luck Sport untuk SAR, patroli, dan rekreasi air. Tahan banting dengan lantai aluminium. Hubungi CS untuk ukuran & harga.",
    price: 0,
    price_original: null,
    images: [
      "/gambar-ls/ls-10.jpg",
      "/gambar-ls/ls-11.jpg",
      "/gambar-ls/ls-12.jpg",
      "/gambar-ls/ls-13.jpg",
    ],
    variants: VARIANT,
    badges: ["new"],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
];

// ── Query helpers (memodelkan layer data; di produksi diganti CMS/API) ──

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.is_active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.is_active);
}

export function getProductsByCategory(category: Category): Product[] {
  return getActiveProducts().filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getActiveProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return getActiveProducts()
    .filter((p) => p.badges.length > 0)
    .slice(0, limit);
}

// Total stok lintas varian — untuk indikator ketersediaan.
export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export type StockStatus = "Tersedia" | "Stok Terbatas" | "Habis";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "Habis";
  if (stock <= 5) return "Stok Terbatas";
  return "Tersedia";
}

// Kategori yang harganya tidak ditampilkan — pelanggan diarahkan menghubungi CS
// (mis. Perahu, produk high-ticket / harga menyesuaikan spesifikasi).
export const CALL_FOR_PRICE_CATEGORIES: Category[] = ["Perahu"];

export function isCallForPrice(product: Product): boolean {
  return CALL_FOR_PRICE_CATEGORIES.includes(product.category);
}

export function isCallForPriceCategory(category: Category | string): boolean {
  return (CALL_FOR_PRICE_CATEGORIES as string[]).includes(category);
}

export const CATEGORIES: {
  name: Category;
  slug: string;
  description: string;
  image: string;
}[] = [
  {
    name: "Perahu",
    slug: "perahu",
    description: "Kayak, kano, perahu karet & SUP",
    image: "/gambar-ls/ls-10.jpg",
  },
];

export function formatIDR(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}
