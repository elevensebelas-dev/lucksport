# Rencana Migrasi Database — Lucksport

Status: **rencana** (belum dieksekusi). Dokumen ini siap dijalankan begitu database
diprovisioning. Tujuannya memindahkan data admin dari file JSON (`data/*.json`,
`public/uploads`) ke **PostgreSQL + object storage**, agar produk/ulasan/restock
**tersimpan permanen di produksi (Vercel)**.

Konteks masalah: filesystem Vercel read-only saat runtime → store berbasis file
tidak persist. Upload sudah dipindah ke Vercel Blob (commit `a11e4cd`). Langkah
ini menuntaskan sisi data.

---

## 1. Ruang lingkup

**Masuk migrasi (server-persisted):**
- `products` — dari `lib/store.ts` + `data/products.json` / seed `lib/products.ts`
- `reviews` — dari `lib/reviews.ts` + `data/reviews.json`
- `restock_requests` — dari `lib/restock.ts` + `data/restock.json`

**Tidak masuk (tetap seperti sekarang):**
- Keranjang & riwayat order → `localStorage` (client-side, `CartContext`/`OrdersContext`).
  Baru perlu DB kalau nanti ada checkout server-side sungguhan.
- Auth admin → tetap password tunggal via env (bisa jadi tabel `users` di fase lain).
- Upload file → sudah ke Vercel Blob.

---

## 2. Pilihan teknologi (rekomendasi)

| Komponen | Rekomendasi | Alasan |
|---|---|---|
| Database | **PostgreSQL** via **Supabase** *atau* **Neon** *atau* **Vercel Postgres** | Semua kompatibel; string koneksi standar |
| Driver | **`postgres`** (porsager) | Ringan, cocok serverless, portabel semua Postgres |
| ORM | **Drizzle ORM** (+`drizzle-kit`) | Type-safe, skema = TypeScript, migrasi rapi, ringan |
| Object storage | **Vercel Blob** (sudah terpasang) | Upload sudah diarahkan ke sini |

> Alternatif tanpa ORM: raw SQL dengan `postgres`. Drizzle dipilih agar tipe tabel
> selaras dengan `lib/types.ts` dan mengurangi bug.

**Env yang dibutuhkan (diisi Anda di Vercel + `.env.local`):**
```
DATABASE_URL=postgres://user:pass@host:5432/db?sslmode=require
```
- Serverless butuh **koneksi pooled**: Supabase → gunakan **Connection Pooler**
  (port 6543, `?pgbouncer=true`); Neon → endpoint **-pooler**; Vercel Postgres →
  `POSTGRES_URL` (sudah pooled).

---

## 3. Skema database

Denormalisasi terukur: `images`, `variants`, `badges` disimpan sebagai **`jsonb`**
(mengikuti bentuk objek saat ini) — sederhana, satu baris per produk, admin mengedit
produk utuh. Normalisasi varian ke tabel terpisah dicatat sebagai opsi fase lanjut.

### 3.1 SQL DDL

```sql
-- Kategori & badge divalidasi di aplikasi (validateInput); disimpan sebagai text.

CREATE TABLE products (
  product_id     text PRIMARY KEY,
  slug           text NOT NULL UNIQUE,
  name           text NOT NULL,
  category       text NOT NULL,               -- Kayak | Kano | Perahu Karet | SUP | Lainnya
  description    text NOT NULL DEFAULT '',
  description_en text,
  model3d        text,                          -- URL .glb (Vercel Blob) opsional
  price          integer NOT NULL DEFAULT 0,   -- IDR (rupiah, tanpa desimal)
  price_original integer,                       -- IDR, harus > price bila diisi
  images         jsonb NOT NULL DEFAULT '[]',  -- string[]
  variants       jsonb NOT NULL DEFAULT '[]',  -- {size,color,stock}[]
  badges         jsonb NOT NULL DEFAULT '[]',  -- ("new"|"best_seller"|"sale")[]
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_active_idx   ON products (is_active);
CREATE INDEX products_category_idx ON products (category);

CREATE TABLE reviews (
  id         text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  name       text NOT NULL,
  rating     smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    text NOT NULL DEFAULT '',
  approved   boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reviews_product_approved_idx ON reviews (product_id, approved);

CREATE TABLE restock_requests (
  id           text PRIMARY KEY,
  product_id   text NOT NULL,                  -- referensi lunak (produk bisa terhapus)
  product_name text NOT NULL,                  -- snapshot nama saat diminta
  contact      text NOT NULL DEFAULT '',       -- WA/email opsional
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX restock_created_idx ON restock_requests (created_at DESC);
```

Catatan tipe:
- `price` `integer` menampung s/d ~2,1 miliar IDR (cukup untuk perahu). Naikkan ke
  `bigint` bila butuh nilai lebih tinggi.
- `images`/`badges` bisa juga `text[]` (array native). `jsonb` dipilih agar seragam
  dengan `variants` dan langsung cocok dengan `JSON.parse` lama.

### 3.2 Skema Drizzle (`lib/db/schema.ts`)

```ts
import { pgTable, text, integer, boolean, jsonb, smallint, timestamp, index } from "drizzle-orm/pg-core";
import type { Variant, Badge } from "@/lib/types";

export const products = pgTable("products", {
  productId:     text("product_id").primaryKey(),
  slug:          text("slug").notNull().unique(),
  name:          text("name").notNull(),
  category:      text("category").notNull(),
  description:   text("description").notNull().default(""),
  descriptionEn: text("description_en"),
  model3d:       text("model3d"),
  price:         integer("price").notNull().default(0),
  priceOriginal: integer("price_original"),
  images:        jsonb("images").$type<string[]>().notNull().default([]),
  variants:      jsonb("variants").$type<Variant[]>().notNull().default([]),
  badges:        jsonb("badges").$type<Badge[]>().notNull().default([]),
  isActive:      boolean("is_active").notNull().default(true),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  activeIdx:   index("products_active_idx").on(t.isActive),
  categoryIdx: index("products_category_idx").on(t.category),
}));

export const reviews = pgTable("reviews", {
  id:        text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.productId, { onDelete: "cascade" }),
  name:      text("name").notNull(),
  rating:    smallint("rating").notNull(),
  comment:   text("comment").notNull().default(""),
  approved:  boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  productApprovedIdx: index("reviews_product_approved_idx").on(t.productId, t.approved),
}));

export const restockRequests = pgTable("restock_requests", {
  id:          text("id").primaryKey(),
  productId:   text("product_id").notNull(),
  productName: text("product_name").notNull(),
  contact:     text("contact").notNull().default(""),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 4. Refactor lapisan data (perubahan terbesar: sync → async)

Semua akses data lewat fungsi terkubur di 3 modul. **Kontrak/nama fungsi
dipertahankan**, hanya isi diganti query DB dan **kembaliannya jadi `Promise`**.
Karena itu semua pemanggil harus `await`.

### 4.1 File baru
- `lib/db/client.ts` — koneksi tunggal (singleton) `postgres(DATABASE_URL)` + `drizzle()`.
- `lib/db/schema.ts` — skema di atas.
- `drizzle.config.ts` — konfigurasi `drizzle-kit` (untuk generate & push migrasi).
- `scripts/seed.ts` — isi awal DB dari `lib/products.ts` (SEED) + `data/*.json` bila ada.

### 4.2 File diubah (isi jadi query DB, fungsi jadi `async`)
- `lib/store.ts` — `readAll`, `getActiveProducts`, `getAllProductsAdmin`,
  `getProductBySlug`, `getProductById`, `getProductsByCategory`, `getRelatedProducts`,
  `getFeaturedProducts`, `createProduct`, `updateProduct`, `setActive`, `deleteProduct`
  → **async**. `validateInput`, `slugify` tetap sinkron. `uniqueSlug` → async (query).
  `getRatingSummaries`/agregasi rating dipindah ke SQL `GROUP BY` (lebih efisien).
- `lib/reviews.ts` — `readReviews`, `getApprovedReviews`, `getAllReviews`,
  `getRatingSummary`, `getRatingSummaries`, `addReview`, `setReviewApproved`,
  `deleteReview` → **async**.
- `lib/restock.ts` — `readRestock`, `getAllRestock`, `addRestock`, `deleteRestock` → **async**.

### 4.3 Pemanggil yang perlu `await` (tambah `await`, pastikan handler/komponen async)
Server Components (halaman) & route handler:
- `app/(store)/page.tsx`, `app/(store)/katalog/page.tsx`,
  `app/(store)/produk/[slug]/page.tsx`, `app/(store)/promo/page.tsx`,
  `app/(store)/wishlist/page.tsx`
- `app/admin/(panel)/page.tsx`, `app/admin/(panel)/restock/page.tsx`,
  `app/admin/(panel)/ulasan/page.tsx`
- `app/api/products/route.ts`, `app/api/products/[id]/route.ts`,
  `app/api/reviews/route.ts`, `app/api/admin/reviews/route.ts`,
  `app/api/admin/reviews/[id]/route.ts`, `app/api/restock/route.ts`,
  `app/api/admin/restock/route.ts`, `app/api/admin/restock/[id]/route.ts`,
  `app/api/search/route.ts`
- `app/sitemap.ts`

> TypeScript akan menandai setiap tempat yang lupa `await` (tipe `Promise<Product[]>`
> vs `Product[]`), jadi kompilator memandu refactor — risiko terlewat rendah.

### 4.4 Strategi fallback (de-risk dev & transisi)
Lapisan data cek `process.env.DATABASE_URL`:
- **ada** → pakai DB (produksi & dev yang sudah terhubung).
- **tidak ada** → pakai perilaku lama (baca `data/*.json` / SEED, read-only).

Manfaat: dev tanpa DB tetap jalan; deploy tanpa `DATABASE_URL` tidak crash;
migrasi bisa diaktifkan hanya dengan set env. (Fungsi tetap `async` di kedua jalur.)

---

## 5. Migrasi data (seed awal)

1. Jalankan DDL (via `drizzle-kit push` atau file SQL di §3.1).
2. `scripts/seed.ts`:
   - Sumber: `data/products.json` bila ada, jika tidak → `SEED` dari `lib/products.ts`.
   - `INSERT ... ON CONFLICT (product_id) DO NOTHING` (idempoten, aman diulang).
   - Sertakan `data/reviews.json` & `data/restock.json` bila ada.
3. Verifikasi jumlah baris = jumlah item sumber.

Perintah:
```
npm run db:push     # buat/ubah tabel (drizzle-kit)
npm run db:seed     # isi data awal
```

---

## 6. Rencana rollout & verifikasi

1. **Provisioning** DB (Anda), salin `DATABASE_URL` pooled ke `.env.local` + Vercel env.
2. `db:push` → `db:seed` (lokal, menunjuk DB dev/staging).
3. **Uji lokal** (production build): homepage, katalog, detail produk, admin CRUD
   (tambah/edit/hapus produk, moderasi ulasan) — semua baca/tulis DB.
4. Aktifkan **Vercel Blob** (agar upload gambar produk hidup) bila belum.
5. Set `DATABASE_URL` di Vercel → deploy → verifikasi rute `/`, `/katalog`,
   `/produk/[slug]`, `/admin` (login → tambah produk → muncul di storefront).
6. Uji end-to-end: **tambah produk + upload foto via admin di produksi → tampil**.

Kriteria sukses: perubahan admin di produksi **bertahan** setelah redeploy / cold start.

---

## 7. Rollback

- Migrasi diaktifkan oleh `DATABASE_URL`. **Hapus/nonaktifkan env → otomatis kembali**
  ke perilaku file/SEED lama (fungsi fallback tetap ada).
- Tidak ada perubahan skema destruktif pada data lama (file JSON tak disentuh).
- Kode lama tetap di riwayat git; revert commit migrasi bila perlu.

---

## 8. Dependensi & script baru

`package.json`:
```jsonc
"dependencies": { "drizzle-orm": "^latest", "postgres": "^latest" }
"devDependencies": { "drizzle-kit": "^latest", "tsx": "^latest" }
"scripts": {
  "db:push": "drizzle-kit push",
  "db:seed": "tsx scripts/seed.ts"
}
```

---

## 9. Estimasi effort

| Bagian | Perkiraan |
|---|---|
| Skema + client + config Drizzle | kecil |
| Refactor 3 modul data (sync→async + query) | sedang |
| Tambah `await` di ~18 pemanggil (dipandu TS) | kecil–sedang |
| Seed script + verifikasi | kecil |
| Uji end-to-end lokal + produksi | sedang |

**Total: 1 sesi kerja terfokus** setelah DB tersedia. Risiko rendah karena kontrak
fungsi dipertahankan, TypeScript memandu perubahan, dan ada jalur fallback.

---

## 10. Yang saya butuhkan dari Anda untuk eksekusi
1. **Pilih & provisioning DB** (Supabase / Neon / Vercel Postgres).
2. Beri `DATABASE_URL` **pooled** (taruh di `.env.local`; jangan kirim via chat bila
   berisi kredensial sensitif — set langsung di file/Vercel).
3. **Aktifkan Vercel Blob** (agar foto produk hasil upload tampil).

Setelah itu saya eksekusi §4–§6 dan verifikasi end-to-end.
