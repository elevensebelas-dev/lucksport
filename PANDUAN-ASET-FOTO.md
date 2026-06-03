# Panduan Penggantian Foto Placeholder → Aset Asli

Saat ini semua foto memakai placeholder (Unsplash). Dokumen ini berisi daftar
**persis** aset yang dibutuhkan situs, lengkap dengan nama file & spesifikasi,
agar penggantian cepat dan rapi.

Ada **2 cara** mengganti — pilih salah satu:

---

## Cara A — Lewat Panel Admin (tanpa koding) ✅ paling mudah

Cocok untuk foto **produk**. Tidak perlu menyentuh kode.

1. Buka `http://localhost:3000/admin` → login.
2. Pada tiap produk klik **Edit**.
3. Di bagian **Foto Produk**, hapus foto placeholder (ikon ✕), lalu
   **seret/upload** foto asli (bisa beberapa, maks 8). Foto pertama = foto utama.
4. Klik **Simpan Perubahan**. Selesai — langsung tampil di toko.

> Foto yang diupload tersimpan di `public/uploads/` dan tercatat otomatis.

---

## Cara B — Bulk lewat folder (saya yang wiring)

Cocok jika ingin mengganti **banyak sekaligus** termasuk hero & kategori.
Letakkan file sesuai nama di bawah, lalu beri tahu saya — saya arahkan datanya.

**Spesifikasi umum**
- Format: **JPG** atau **WebP** (hindari PNG besar untuk foto).
- Produk: rasio **1:1 (persegi)**, min **1000×1000px**, background putih/abu muda.
- Hero: rasio **landscape**, min **1600×900px** (lifestyle photo).
- Kategori: rasio **potret 4:5**, min **800×1000px**.

### 1) Foto Produk → taruh di `public/products/`

Nama file: `<slug>-1.jpg`, `<slug>-2.jpg`, dst. (foto ke-1 jadi utama)

| # | Produk | Slug | Jumlah foto |
|---|--------|------|:-----------:|
| 1 | Jersey Pro Elite Home | `jersey-pro-elite-home` | 3 |
| 2 | Jersey Classic Stripe | `jersey-classic-stripe` | 2 |
| 3 | Jersey Training Mesh | `jersey-training-mesh` | 3 |
| 4 | Sepatu Runner X-Speed | `sepatu-runner-x-speed` | 3 |
| 5 | Sepatu Court Grip Basket | `sepatu-court-grip-basket` | 2 |
| 6 | Sepatu Daily Trainer | `sepatu-daily-trainer` | 2 |
| 7 | Celana Training Flex | `celana-training-flex` | 2 |
| 8 | Celana Pendek Active Dry | `celana-pendek-active-dry` | 2 |
| 9 | Celana Jogger Everyday | `celana-jogger-everyday` | 2 |
| 10 | Kaos Kaki Pro Cushion | `kaos-kaki-pro-cushion` | 2 |
| 11 | Topi Sport Cap Dry-Fit | `topi-sport-cap-dryfit` | 2 |
| 12 | Tas Gym Duffel Compact | `tas-gym-duffel-compact` | 2 |

Contoh: `public/products/sepatu-runner-x-speed-1.jpg` … `-2.jpg` … `-3.jpg`

### 2) Banner Hero (homepage) → `public/products/`
- `hero-1.jpg` — "Temukan Gear Olahraga Terbaik"
- `hero-2.jpg` — fokus sepatu
- `hero-3.jpg` — fokus jersey/tim

**Hero juga bisa berupa VIDEO** 🎬 (slider sudah mendukung):
- Taruh `hero-1.mp4` (atau `.webm`) di `public/products/`.
- Saran: durasi 5–15 dtk, sudah dikompres, **< 8–10MB**, 720p/1080p, rasio
  landscape. Sertakan poster `hero-1.jpg` (frame awal/fallback).
- Video diputar **tanpa suara** (syarat autoplay browser) & **otomatis lanjut
  ke slide berikutnya saat selesai**. Slide gambar tetap berganti tiap 4 detik.
- Aktivasi: di `components/HeroSlider.tsx`, ubah slide menjadi
  `type: "video", video: "/products/hero-1.mp4"` (poster = field `image`).
  Beri tahu saya, atau saya bisa aktifkan begitu file-nya ada.

### 3) Foto Kategori → `public/products/`
- `kategori-jersey.jpg`
- `kategori-sepatu.jpg`
- `kategori-celana.jpg`
- `kategori-aksesori.jpg`

### 4) Halaman "Tentang Kami" → `public/products/`
- `tentang-hero.jpg` (landscape)
- `tentang-cerita.jpg` (landscape/4:3)

### 5) Brand (opsional) → `public/brand/`
- `logo.svg` atau `logo.png` (logo Lucksport)
- `favicon.ico` / `icon.png` (512×512)
- `og-image.jpg` (1200×630, untuk share sosial media)

---

## Setelah file siap

Beri tahu saya: **"foto sudah di public/products"** (atau sebagian saja).
Saya akan:
- Arahkan data produk & komponen (hero, kategori, tentang) ke path lokal.
- Hapus ketergantungan Unsplash dari `next.config.mjs`.
- Pastikan tidak ada broken image, lalu build & uji ulang.

Tidak harus lengkap sekaligus — kirim yang sudah ada, sisanya menyusul.
