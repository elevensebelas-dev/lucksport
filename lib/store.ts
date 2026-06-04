// ─────────────────────────────────────────────────────────────────────────
// Server-only data store untuk produk (PRD §8 — manajemen konten produk).
//
// Sumber kebenaran runtime = data/products.json. File ini di-seed otomatis
// dari katalog awal (lib/products.ts) saat pertama dijalankan, lalu seluruh
// operasi admin (tambah/edit/hapus) menulis ke file ini.
//
// CATATAN: penyimpanan berbasis file cocok untuk dev & self-hosted (VPS).
// Di platform serverless read-only (mis. Vercel), ganti layer ini dengan
// Headless CMS / database sesuai PRD §7.1.
// ─────────────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { products as SEED, isCallForPriceCategory } from "./products";
import type { Product, Category, Variant, Badge } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "products.json");

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(SEED, null, 2), "utf-8");
  }
}

export function readAll(): Product[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    const list = JSON.parse(raw) as Product[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [...SEED];
  }
}

function writeAll(list: Product[]): void {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// ── Query (storefront) ──
export function getActiveProducts(): Product[] {
  return readAll().filter((p) => p.is_active);
}

export function getAllProductsAdmin(): Product[] {
  // Termasuk produk nonaktif, urut terbaru diperbarui.
  return readAll().sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return getActiveProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return readAll().find((p) => p.product_id === id);
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

// ── Util ──
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function uniqueSlug(base: string, excludeId?: string): string {
  const list = readAll();
  let slug = base || "produk";
  let i = 2;
  while (list.some((p) => p.slug === slug && p.product_id !== excludeId)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ── Validasi & normalisasi input dari form/API ──
export interface ProductInput {
  name: string;
  category: Category;
  description: string;
  price: number;
  price_original?: number | null;
  images: string[];
  variants: Variant[];
  badges: Badge[];
  is_active?: boolean;
}

const CATEGORIES_VALID: Category[] = [
  "Jersey",
  "Sepatu",
  "Celana",
  "Aksesori",
  "Perahu",
  "Lainnya",
];
const BADGES_VALID: Badge[] = ["new", "best_seller", "sale"];

export function validateInput(input: Partial<ProductInput>): {
  ok: boolean;
  error?: string;
  value?: ProductInput;
} {
  const name = (input.name ?? "").toString().trim();
  if (!name) return { ok: false, error: "Nama produk wajib diisi." };

  const category = input.category as Category;
  if (!CATEGORIES_VALID.includes(category))
    return { ok: false, error: "Kategori tidak valid." };

  // Kategori "Call CS" (mis. Perahu) tidak menampilkan harga → harga boleh 0/kosong.
  const callForPrice = isCallForPriceCategory(category);
  const price = Number(input.price) || 0;
  if (!callForPrice && (!Number.isFinite(price) || price <= 0))
    return { ok: false, error: "Harga harus berupa angka lebih dari 0." };

  let price_original: number | null = null;
  if (input.price_original != null && `${input.price_original}` !== "") {
    price_original = Number(input.price_original);
    if (!Number.isFinite(price_original) || price_original <= price)
      return {
        ok: false,
        error: "Harga sebelum diskon harus lebih besar dari harga jual.",
      };
  }

  const images = (input.images ?? []).filter(
    (u) => typeof u === "string" && u.trim()
  );
  if (images.length < 1)
    return { ok: false, error: "Minimal 1 foto produk diperlukan." };
  if (images.length > 8)
    return { ok: false, error: "Maksimal 8 foto produk." };

  const variants = (input.variants ?? []).filter(
    (v) => v && `${v.size}`.trim() && `${v.color}`.trim()
  );
  if (variants.length < 1)
    return { ok: false, error: "Minimal 1 varian (ukuran + warna) diperlukan." };

  const cleanVariants: Variant[] = variants.map((v) => ({
    size: `${v.size}`.trim(),
    color: `${v.color}`.trim(),
    stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
  }));

  const badges = (input.badges ?? []).filter((b) =>
    BADGES_VALID.includes(b)
  );

  return {
    ok: true,
    value: {
      name,
      category,
      description: (input.description ?? "").toString().trim(),
      price,
      price_original,
      images,
      variants: cleanVariants,
      badges,
      is_active: input.is_active !== false,
    },
  };
}

// ── Mutasi ──
export function createProduct(input: ProductInput): Product {
  const list = readAll();
  const now = new Date().toISOString();
  const product: Product = {
    product_id:
      (globalThis.crypto?.randomUUID?.() as string) ?? `id-${Date.now()}`,
    slug: uniqueSlug(slugify(input.name)),
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    price_original: input.price_original ?? null,
    images: input.images,
    variants: input.variants,
    badges: input.badges,
    is_active: input.is_active ?? true,
    created_at: now,
    updated_at: now,
  };
  list.push(product);
  writeAll(list);
  return product;
}

export function updateProduct(
  id: string,
  input: ProductInput
): Product | null {
  const list = readAll();
  const idx = list.findIndex((p) => p.product_id === id);
  if (idx === -1) return null;
  const prev = list[idx];
  const updated: Product = {
    ...prev,
    name: input.name,
    slug:
      slugify(input.name) !== prev.slug
        ? uniqueSlug(slugify(input.name), id)
        : prev.slug,
    category: input.category,
    description: input.description,
    price: input.price,
    price_original: input.price_original ?? null,
    images: input.images,
    variants: input.variants,
    badges: input.badges,
    is_active: input.is_active ?? true,
    updated_at: new Date().toISOString(),
  };
  list[idx] = updated;
  writeAll(list);
  return updated;
}

export function setActive(id: string, active: boolean): Product | null {
  const list = readAll();
  const idx = list.findIndex((p) => p.product_id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    is_active: active,
    updated_at: new Date().toISOString(),
  };
  writeAll(list);
  return list[idx];
}

export function deleteProduct(id: string): boolean {
  const list = readAll();
  const next = list.filter((p) => p.product_id !== id);
  if (next.length === list.length) return false;
  writeAll(next);
  return true;
}
