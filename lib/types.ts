// Struktur data produk sesuai PRD 8.2

export type Category = "Kayak" | "Kano" | "Perahu Karet" | "SUP" | "Lainnya";

export type Badge = "new" | "best_seller" | "sale";

export interface Variant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  product_id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  description_en?: string; // deskripsi versi English (opsional)
  model3d?: string; // URL file model 3D (.glb) untuk 3D viewer (opsional)
  price: number;
  price_original: number | null;
  images: string[];
  variants: Variant[];
  badges: Badge[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Item dalam keranjang belanja
export interface CartItem {
  product_id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

// ── Fase 3 ──

// Ulasan & rating produk (PRD §9)
export interface Review {
  id: string;
  product_id: string;
  name: string;
  rating: number; // 1–5
  comment: string;
  approved: boolean;
  created_at: string;
}

// Permintaan notifikasi stok kembali (back-in-stock)
export interface RestockRequest {
  id: string;
  product_id: string;
  product_name: string;
  contact: string; // WA/email opsional
  created_at: string;
}

// Riwayat pesanan (disimpan lokal saat checkout via WhatsApp)
export interface Order {
  id: string;
  created_at: string;
  items: CartItem[];
  subtotal: number;
  note?: string;
  shipping?: {
    province: string;
    courier: string;
    service: string;
    cost: number;
  } | null;
}

// Opsi ongkir dari estimator
export interface ShippingOption {
  courier: string;
  service: string;
  cost: number;
  etd: string; // estimasi hari
}
