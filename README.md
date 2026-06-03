# Lucksport — Website E-Commerce

Website e-commerce untuk **Lucksport**, toko perlengkapan olahraga. Menampilkan
katalog produk visual-first, keranjang belanja, dan checkout via WhatsApp —
dibangun sesuai [PRD Lucksport v1.0](#) (Fase 1 — MVP).

## Tech Stack

Sesuai rekomendasi PRD §7.1:

- **Next.js 15** (App Router) + **React 19** — SSG/SEO-friendly, performa tinggi
- **TypeScript** — type safety
- **Tailwind CSS** — styling, mobile-first
- **next/image** — optimasi & lazy loading gambar (format WebP otomatis)

Tanpa backend pada Fase 1: data produk dimodelkan di `lib/products.ts` (siap
diganti Headless CMS), keranjang disimpan di `localStorage`, dan order dikirim
ke CS via link `wa.me`.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

Build produksi:

```bash
npm run build && npm start
```

## Konfigurasi

Edit `lib/config.ts`:

| Field            | Keterangan                                   |
| ---------------- | -------------------------------------------- |
| `whatsappNumber` | Nomor WA CS, format internasional tanpa `+`  |
| `instagram`      | Handle Instagram                             |
| `email`, `domain`| Kontak & domain brand                        |
| jam operasional  | Hari & jam layanan CS                        |

> Nomor WhatsApp default (`6281234567890`) adalah placeholder — ganti dengan
> nomor CS Lucksport sebelum go-live.

## Panel Admin (CMS) — `/admin`

Manajemen produk mandiri tanpa developer (PRD §8):

- **Login:** buka `http://localhost:3000/admin` → diarahkan ke halaman login.
  Password default `lucksport123` (ganti sebelum go-live).
- **Fitur:** tambah / edit / hapus produk, toggle aktif-nonaktif, upload foto
  (drag-drop, maks 8), editor varian (ukuran/warna/stok) + generator massal,
  badge, harga diskon, dan **"Isi cepat dari caption Instagram"** (auto-isi
  nama, harga, kategori, deskripsi dari caption IG).
- **Penyimpanan:** data ke `data/products.json`, foto ke `public/uploads/`.

### Konfigurasi keamanan (wajib sebelum go-live)

Salin `.env.example` → `.env.local` lalu isi:

```bash
ADMIN_PASSWORD=passwordRahasiaAnda
AUTH_SECRET=$(openssl rand -hex 32)
```

Proteksi diterapkan oleh `middleware.ts`: semua rute `/admin/*` dan API mutasi
(`/api/products*`, `/api/upload`) butuh sesi login (cookie httpOnly). Storefront
tetap publik.

> Penyimpanan berbasis file cocok untuk dev & VPS. Di platform serverless
> read-only (Vercel), pindahkan ke database + object storage atau Headless CMS.

## Struktur Proyek

```
app/
  layout.tsx              # root layout: Header, Footer, MiniCart, FloatingWA, CartProvider
  page.tsx                # Homepage: hero slider, kategori, produk pilihan
  katalog/                # Katalog + filter (kategori/harga/stok), search, sort
  produk/[slug]/          # Detail produk (SSG) + galeri zoom + produk terkait
  keranjang/              # Halaman keranjang penuh + checkout
  tentang-kami/ faq/ kebijakan/
  sitemap.ts robots.ts    # SEO
components/               # Header, Footer, HeroSlider, ProductCard, MiniCart, ProductDetail, ...
context/CartContext.tsx   # State keranjang + persistensi localStorage
lib/
  products.ts             # Data & query produk (proxy CMS)
  whatsapp.ts             # Generator pesan & link wa.me
  config.ts  types.ts
```

## Peta Fitur ↔ PRD (Fase 1 MVP)

- ✅ **Homepage** — hero slider 80vh autoplay 4 dtk + arrows/dots, grid kategori
  (hover zoom), produk pilihan, trust strip (§5.1)
- ✅ **Katalog** — grid foto besar, filter kategori/harga/ketersediaan, search,
  sort, hitung "Menampilkan X dari Y", hover CTA, lazy load (§5.2)
- ✅ **Detail produk** — galeri foto besar + thumbnail + zoom on hover, harga
  coret diskon, swatch warna, pilihan ukuran + indikator stok, modal panduan
  ukuran, breadcrumb, produk terkait (§5.3)
- ✅ **Keranjang** — mini-cart drawer + halaman penuh, edit qty, hapus, catatan,
  subtotal (§5.4)
- ✅ **Checkout WhatsApp** — ringkasan pesanan otomatis terformat (§5.4.3)
- ✅ **Floating WA** — sticky di semua halaman dengan pesan template (§5.1.4 / §5.5)
- ✅ **Tentang Kami / FAQ / Kebijakan** (§5.6)
- ✅ **Responsif** mobile-first (375/768/1024/1280px), tanpa overflow horizontal
- ✅ **SEO** — metadata per halaman, sitemap, robots, SSG produk

## Peta Fitur ↔ PRD (Fase 2 — Enhancement, §9)

- ✅ **Pencarian autocomplete** — saran produk real-time di header
  (`/api/search`, debounce + navigasi keyboard)
- ✅ **Wishlist / favorit** — ikon hati di kartu & detail, halaman `/wishlist`,
  badge di header, persist localStorage
- ✅ **Halaman promo** — `/promo` dengan hero kampanye + grid diskon (urut potongan
  terbesar) + produk terlaris
- ✅ **SEO lanjutan** — structured data JSON-LD (Product, BreadcrumbList,
  Organization, WebSite + SearchAction)
- ✅ **Google Analytics 4 & Meta Pixel** — via `NEXT_PUBLIC_GA_ID` &
  `NEXT_PUBLIC_META_PIXEL_ID` (lihat `components/Analytics.tsx`)
- ✅ **Optimasi gambar lanjutan** — blur placeholder (shimmer) pada semua foto

## Peta Fitur ↔ PRD (Fase 3 — Advanced, §9)

- ✅ **Review & rating produk** — pelanggan beri bintang + ulasan; rata-rata di
  kartu, detail, & JSON-LD `aggregateRating`. Moderasi di `/admin/ulasan`
- ✅ **Riwayat pesanan** — tersimpan otomatis (localStorage) saat checkout WA,
  halaman `/pesanan` dengan opsi lanjut ke WA
- ✅ **Notifikasi stok kembali** — form pada produk habis → tersimpan ke server,
  dikelola di `/admin/restock` (link WA/email cepat)
- ✅ **Estimasi ongkir** — di keranjang, per provinsi & kurir; pakai RajaOngkir
  bila `RAJAONGKIR_API_KEY` diisi, jika tidak pakai tabel fallback. Ongkir
  masuk ke pesan checkout WhatsApp
- ✅ **Dashboard analitik admin** (`/admin`) — KPI produk, nilai inventaris,
  stok menipis/habis, rating rata-rata, permintaan restock, breakdown kategori

API publik: `/api/reviews`, `/api/restock`, `/api/shipping`, `/api/search`.
API admin (dilindungi middleware): `/api/admin/reviews*`, `/api/admin/restock*`,
`/api/products*`, `/api/upload`.

### Belum termasuk (Out of Scope §11.2)

Payment gateway otomatis (Midtrans/Xendit), akun/login pelanggan penuh,
multi-bahasa, dan integrasi marketplace (Tokopedia/Shopee) — di luar cakupan.
Riwayat pesanan saat ini berbasis perangkat (localStorage); untuk lintas-perangkat
diperlukan sistem akun pelanggan.

## Catatan Gambar

Foto produk saat ini memakai URL Unsplash sebagai placeholder demo. Untuk
produksi, ganti dengan foto asli Lucksport (min. 1000×1000px, §11.1) melalui CMS,
dan tambahkan host gambar pada `next.config.mjs` (`images.remotePatterns`).
