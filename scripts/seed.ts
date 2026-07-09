// Isi awal database dari data/*.json (bila ada) atau SEED lib/products.ts.
// Idempoten: ON CONFLICT DO NOTHING. Jalankan: npm run db:seed
//
// Memakai DIRECT_URL (port 5432) bila ada, jika tidak DATABASE_URL.
import fs from "fs";
import path from "path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { products, reviews, restockRequests } from "../lib/db/schema";
import { products as SEED } from "../lib/products";
import type { Product, Review, RestockRequest } from "../lib/types";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DIRECT_URL / DATABASE_URL belum diset.");
  process.exit(1);
}

const DATA_DIR = path.join(process.cwd(), "data");
function readJson<T>(file: string): T[] {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try {
    const v = JSON.parse(fs.readFileSync(p, "utf-8"));
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

async function main() {
  const sql = postgres(url!, { prepare: false, max: 1 });
  const db = drizzle(sql, { schema: { products, reviews, restockRequests } });

  // Produk: dari file lokal bila ada, jika tidak dari SEED bawaan.
  const localProducts = readJson<Product>("products.json");
  const srcProducts = localProducts.length ? localProducts : (SEED as Product[]);

  const rows = srcProducts.map((p) => ({
    productId: p.product_id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description ?? "",
    descriptionEn: p.description_en ?? null,
    model3d: p.model3d ?? null,
    price: Math.round(Number(p.price) || 0),
    priceOriginal:
      p.price_original == null ? null : Math.round(Number(p.price_original)),
    images: p.images ?? [],
    variants: p.variants ?? [],
    badges: p.badges ?? [],
    isActive: p.is_active !== false,
    createdAt: p.created_at ? new Date(p.created_at) : new Date(),
    updatedAt: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  if (rows.length) {
    await db.insert(products).values(rows).onConflictDoNothing();
  }
  console.log(`✓ products: ${rows.length} baris disemai`);

  // Ulasan (opsional).
  const rv = readJson<Review>("reviews.json").map((r) => ({
    id: r.id,
    productId: r.product_id,
    name: r.name,
    rating: r.rating,
    comment: r.comment ?? "",
    approved: r.approved !== false,
    createdAt: r.created_at ? new Date(r.created_at) : new Date(),
  }));
  if (rv.length) {
    await db.insert(reviews).values(rv).onConflictDoNothing();
  }
  console.log(`✓ reviews: ${rv.length} baris disemai`);

  // Restock (opsional).
  const rs = readJson<RestockRequest>("restock.json").map((r) => ({
    id: r.id,
    productId: r.product_id,
    productName: r.product_name,
    contact: r.contact ?? "",
    createdAt: r.created_at ? new Date(r.created_at) : new Date(),
  }));
  if (rs.length) {
    await db.insert(restockRequests).values(rs).onConflictDoNothing();
  }
  console.log(`✓ restock_requests: ${rs.length} baris disemai`);

  await sql.end();
  console.log("Selesai.");
}

main().catch((err) => {
  console.error("✗ Seed gagal:", err);
  process.exit(1);
});
