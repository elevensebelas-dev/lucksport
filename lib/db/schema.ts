// Skema database Drizzle (PostgreSQL / Supabase) — lihat docs/DB_MIGRATION_PLAN.md.
// images/variants/badges disimpan jsonb (mengikuti bentuk objek di lib/types.ts).
//
// KEAMANAN — semua tabel memakai .enableRLS() tanpa policy sama sekali.
// Supabase mengekspos schema `public` lewat PostgREST, dan peran `anon`
// (kuncinya memang dirancang publik) semula punya hak penuh termasuk TRUNCATE.
// Dengan RLS aktif dan tanpa policy, peran itu tidak memperoleh satu baris pun.
// Aplikasi kita TIDAK memakai PostgREST — ia terhubung langsung sebagai peran
// `postgres` (pemilik tabel), yang melewati RLS, sehingga tidak terpengaruh.
// Catatan: RLS tidak berlaku untuk TRUNCATE, jadi hak peran publik juga
// dicabut — lihat scripts/harden-db.sql.
import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  smallint,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import type { Variant, Badge } from "@/lib/types";

export const products = pgTable(
  "products",
  {
    productId: text("product_id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull().default(""),
    descriptionEn: text("description_en"),
    model3d: text("model3d"),
    price: integer("price").notNull().default(0),
    priceOriginal: integer("price_original"),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    variants: jsonb("variants").$type<Variant[]>().notNull().default([]),
    badges: jsonb("badges").$type<Badge[]>().notNull().default([]),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    activeIdx: index("products_active_idx").on(t.isActive),
    categoryIdx: index("products_category_idx").on(t.category),
  })
).enableRLS();

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    rating: smallint("rating").notNull(),
    comment: text("comment").notNull().default(""),
    approved: boolean("approved").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    productApprovedIdx: index("reviews_product_approved_idx").on(
      t.productId,
      t.approved
    ),
  })
).enableRLS();

export const restockRequests = pgTable("restock_requests", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  contact: text("contact").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();
