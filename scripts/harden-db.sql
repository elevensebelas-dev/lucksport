-- Pengerasan keamanan database Supabase.
--
-- Masalah yang diperbaiki (Security Advisor: "RLS Disabled in Public"):
-- Supabase mengekspos schema `public` lewat PostgREST. Peran `anon` — yang
-- kuncinya memang dirancang untuk disebar di sisi klien — semula memiliki hak
-- PENUH (SELECT, INSERT, UPDATE, DELETE, TRUNCATE) atas ketiga tabel, tanpa
-- Row Level Security. Siapa pun dengan anon key dapat membaca kontak pelanggan
-- di restock_requests, mengubah/menghapus produk, atau mengosongkan tabel —
-- melewati seluruh validasi dan rate limit di aplikasi.
--
-- Aplikasi Luck Sport TIDAK memakai PostgREST: ia terhubung langsung lewat
-- protokol Postgres sebagai peran `postgres` (pemilik tabel), yang melewati
-- RLS. Jadi penguncian di bawah tidak mengubah perilaku aplikasi sama sekali.
--
-- Jalankan: npm run db:harden

-- 1) Aktifkan RLS tanpa policy apa pun.
--    Tanpa policy, peran non-pemilik tidak memperoleh satu baris pun.
ALTER TABLE public.products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restock_requests  ENABLE ROW LEVEL SECURITY;

-- 2) Cabut hak peran publik.
--    RLS TIDAK berlaku untuk TRUNCATE, sehingga langkah 1 saja belum cukup:
--    tanpa pencabutan ini, anon masih bisa mengosongkan tabel.
REVOKE ALL ON public.products         FROM anon, authenticated;
REVOKE ALL ON public.reviews          FROM anon, authenticated;
REVOKE ALL ON public.restock_requests FROM anon, authenticated;

-- 3) Tabel baru di masa depan tidak otomatis terbuka lagi.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
