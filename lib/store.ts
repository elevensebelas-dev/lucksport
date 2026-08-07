// ─────────────────────────────────────────────────────────────────────────
// Server-only data store untuk produk (PRD §8 — manajemen konten produk).
//
// Dua mode (lihat docs/DB_MIGRATION_PLAN.md):
//   • DATABASE_URL diset  → PostgreSQL/Supabase via Drizzle (produksi).
//   • DATABASE_URL kosong → fallback file data/products.json (dev/self-host),
//     atau SEED read-only bila file tak ada (serverless tanpa DB).
//
// Seluruh fungsi async agar tanda tangannya sama di kedua mode.
// ─────────────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { eq, desc } from "drizzle-orm";
import { db, requireDb, withRetry } from "./db/client";
import { products as productsTable } from "./db/schema";
import { products as SEED, isCallForPriceCategory } from "./products";
import type { Product, Category, Variant, Badge } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "products.json");

// ── Konversi baris DB ↔ objek Product (bentuk snake_case lib/types.ts) ──
type Row = typeof productsTable.$inferSelect;

function rowToProduct(r: Row): Product {
  return {
    product_id: r.productId,
    slug: r.slug,
    name: r.name,
    category: r.category as Category,
    description: r.description,
    description_en: r.descriptionEn ?? undefined,
    model3d: r.model3d ?? undefined,
    price: r.price,
    price_original: r.priceOriginal,
    images: r.images,
    variants: r.variants,
    badges: r.badges,
    is_active: r.isActive,
    created_at: r.createdAt.toISOString(),
    updated_at: r.updatedAt.toISOString(),
  };
}

// ── Fallback file (perilaku lama, dipertahankan apa adanya) ──
function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(SEED, null, 2), "utf-8");
  }
}

function readAllFile(): Product[] {
  // Baca TANPA pernah menulis: di serverless read-only file ini tak ada &
  // tak bisa dibuat → pakai katalog awal (SEED).
  try {
    if (!fs.existsSync(FILE)) return [...SEED];
    const raw = fs.readFileSync(FILE, "utf-8");
    const list = JSON.parse(raw) as Product[];
    return Array.isArray(list) ? list : [...SEED];
  } catch {
    return [...SEED];
  }
}

function writeAllFile(list: Product[]): void {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// ── Query (storefront) ──
export async function readAll(): Promise<Product[]> {
  if (db) {
    const rows = await withRetry(() => db!.select().from(productsTable));
    return rows.map(rowToProduct);
  }
  return readAllFile();
}

export async function getActiveProducts(): Promise<Product[]> {
  return (await readAll()).filter((p) => p.is_active);
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  // Termasuk produk nonaktif, urut terbaru diperbarui.
  if (db) {
    const rows = await withRetry(() =>
      db!.select().from(productsTable).orderBy(desc(productsTable.updatedAt))
    );
    return rows.map(rowToProduct);
  }
  return readAllFile().sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  if (db) {
    const rows = await withRetry(() =>
      db!.select().from(productsTable).where(eq(productsTable.slug, slug)).limit(1)
    );
    const p = rows[0] ? rowToProduct(rows[0]) : undefined;
    return p?.is_active ? p : undefined;
  }
  return (await getActiveProducts()).find((p) => p.slug === slug);
}

export async function getProductById(
  id: string
): Promise<Product | undefined> {
  if (db) {
    const rows = await withRetry(() =>
      db!.select().from(productsTable).where(eq(productsTable.productId, id)).limit(1)
    );
    return rows[0] ? rowToProduct(rows[0]) : undefined;
  }
  return (await readAll()).find((p) => p.product_id === id);
}

export async function getProductsByCategory(
  category: Category
): Promise<Product[]> {
  return (await getActiveProducts()).filter((p) => p.category === category);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  return (await getActiveProducts())
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return (await getActiveProducts())
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

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const list = await readAll();
  let slug = base || "produk";
  let i = 2;
  while (list.some((p) => p.slug === slug && p.product_id !== excludeId)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ── Validasi & normalisasi input dari form/API (murni, tetap sinkron) ──
export interface ProductInput {
  name: string;
  category: Category;
  description: string;
  description_en?: string;
  model3d?: string;
  price: number;
  price_original?: number | null;
  images: string[];
  variants: Variant[];
  badges: Badge[];
  is_active?: boolean;
}

const CATEGORIES_VALID: Category[] = [
  "Kayak",
  "Kano",
  "Perahu Karet",
  "SUP",
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

  const model3d = (input.model3d ?? "").toString().trim() || undefined;
  const description_en = (input.description_en ?? "").toString().trim() || undefined;

  return {
    ok: true,
    value: {
      name,
      category,
      description: (input.description ?? "").toString().trim(),
      description_en,
      model3d,
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
export async function createProduct(input: ProductInput): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = {
    product_id:
      (globalThis.crypto?.randomUUID?.() as string) ?? `id-${Date.now()}`,
    slug: await uniqueSlug(slugify(input.name)),
    name: input.name,
    category: input.category,
    description: input.description,
    description_en: input.description_en,
    model3d: input.model3d,
    price: input.price,
    price_original: input.price_original ?? null,
    images: input.images,
    variants: input.variants,
    badges: input.badges,
    is_active: input.is_active ?? true,
    created_at: now,
    updated_at: now,
  };

  if (db) {
    await requireDb().insert(productsTable).values({
      productId: product.product_id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      description: product.description,
      descriptionEn: product.description_en ?? null,
      model3d: product.model3d ?? null,
      price: product.price,
      priceOriginal: product.price_original,
      images: product.images,
      variants: product.variants,
      badges: product.badges,
      isActive: product.is_active,
    });
    return product;
  }

  const list = readAllFile();
  list.push(product);
  writeAllFile(list);
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | null> {
  const prev = await getProductById(id);
  if (!prev) return null;

  const slug =
    slugify(input.name) !== prev.slug
      ? await uniqueSlug(slugify(input.name), id)
      : prev.slug;

  const updated: Product = {
    ...prev,
    name: input.name,
    slug,
    category: input.category,
    description: input.description,
    description_en: input.description_en,
    model3d: input.model3d,
    price: input.price,
    price_original: input.price_original ?? null,
    images: input.images,
    variants: input.variants,
    badges: input.badges,
    is_active: input.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (db) {
    await requireDb()
      .update(productsTable)
      .set({
        name: updated.name,
        slug: updated.slug,
        category: updated.category,
        description: updated.description,
        descriptionEn: updated.description_en ?? null,
        model3d: updated.model3d ?? null,
        price: updated.price,
        priceOriginal: updated.price_original,
        images: updated.images,
        variants: updated.variants,
        badges: updated.badges,
        isActive: updated.is_active,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.productId, id));
    return updated;
  }

  const list = readAllFile();
  const idx = list.findIndex((p) => p.product_id === id);
  if (idx === -1) return null;
  list[idx] = updated;
  writeAllFile(list);
  return updated;
}

export async function setActive(
  id: string,
  active: boolean
): Promise<Product | null> {
  if (db) {
    const prev = await getProductById(id);
    if (!prev) return null;
    await requireDb()
      .update(productsTable)
      .set({ isActive: active, updatedAt: new Date() })
      .where(eq(productsTable.productId, id));
    return { ...prev, is_active: active, updated_at: new Date().toISOString() };
  }

  const list = readAllFile();
  const idx = list.findIndex((p) => p.product_id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    is_active: active,
    updated_at: new Date().toISOString(),
  };
  writeAllFile(list);
  return list[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (db) {
    const prev = await getProductById(id);
    if (!prev) return false;
    await requireDb()
      .delete(productsTable)
      .where(eq(productsTable.productId, id));
    return true;
  }

  const list = readAllFile();
  const next = list.filter((p) => p.product_id !== id);
  if (next.length === list.length) return false;
  writeAllFile(next);
  return true;
}
