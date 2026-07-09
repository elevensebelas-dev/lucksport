import { defineConfig } from "drizzle-kit";

// Konfigurasi drizzle-kit (generate & push skema).
//
// Untuk DDL/migrasi, pakai koneksi LANGSUNG Supabase (port 5432) via DIRECT_URL
// bila ada; jika tidak, jatuh ke DATABASE_URL. (Transaction pooler kurang cocok
// untuk operasi DDL.)
//   DIRECT_URL=postgres://postgres.<ref>:<pass>@aws-...pooler.supabase.com:5432/postgres
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
