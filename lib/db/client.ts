// Koneksi database tunggal (singleton) untuk Drizzle + driver `postgres`.
//
// Supabase: gunakan connection string TRANSACTION POOLER (port 6543) untuk
// runtime serverless. Transaction pooling tidak mendukung prepared statements,
// jadi WAJIB `prepare: false`.
//   DATABASE_URL=postgres://postgres.<ref>:<pass>@aws-...pooler.supabase.com:6543/postgres
//
// Migrasi/DDL (`drizzle-kit push`) memakai koneksi langsung (port 5432) via
// DIRECT_URL — lihat drizzle.config.ts.
//
// Bila DATABASE_URL tidak diset → db = null; lapisan data (store/reviews/restock)
// otomatis fallback ke file/SEED lama (lihat docs/DB_MIGRATION_PLAN.md §4.4).
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Bersihkan nilai env dari kesalahan tempel yang umum: tanda kutip pengapit
// (Supabase menampilkan DATABASE_URL="postgres://…") dan spasi/baris baru.
const url = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");

// Cache koneksi antar hot-reload dev agar tidak membuka banyak koneksi.
const globalForDb = globalThis as unknown as {
  _sql?: ReturnType<typeof postgres>;
};

function makeSql() {
  if (!url) return undefined;
  if (globalForDb._sql) return globalForDb._sql;
  try {
    return (globalForDb._sql = postgres(url, {
      prepare: false, // wajib untuk transaction pooler (Supabase/PgBouncer)
      max: 1, // serverless: 1 koneksi per invocation sudah cukup
      // Tutup socket yang menganggur agar proses (build/serverless) bisa keluar
      // dan koneksi pooler tidak tertahan.
      idle_timeout: 20,
      connect_timeout: 10,
    }));
  } catch (err) {
    // DATABASE_URL cacat (mis. salah tempel) tidak boleh merobohkan build atau
    // seluruh situs — catat jelas, lalu jatuh ke data file/SEED.
    console.error(
      "DATABASE_URL tidak valid — situs berjalan tanpa database (fallback file/SEED). " +
        "Periksa nilainya: harus 'postgresql://…:6543/postgres', tanpa tanda kutip.",
      err
    );
    return undefined;
  }
}

const sql = makeSql();

export const db = sql ? drizzle(sql, { schema }) : null;

// Helper: pastikan DB aktif, atau lempar error jelas (dipakai jalur tulis admin).
export function requireDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL belum diset — operasi database tidak tersedia."
    );
  }
  return db;
}
