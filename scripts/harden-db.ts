// Menjalankan scripts/harden-db.sql (RLS + pencabutan hak peran publik).
// Idempoten: aman dijalankan berulang.
//
// Memakai DIRECT_URL (port 5432) karena ini operasi DDL.
import fs from "fs";
import path from "path";
import postgres from "postgres";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DIRECT_URL / DATABASE_URL belum diset.");
  process.exit(1);
}

async function main() {
  const sql = postgres(url!, { prepare: false, max: 1 });
  const file = path.join(process.cwd(), "scripts", "harden-db.sql");
  await sql.unsafe(fs.readFileSync(file, "utf-8"));

  // Tampilkan kondisi akhir sebagai bukti, bukan sekadar "selesai".
  const tables = await sql<{ tablename: string; rowsecurity: boolean }[]>`
    select tablename, rowsecurity from pg_tables
    where schemaname = 'public' order by tablename`;
  const grants = await sql<{ n: number }[]>`
    select count(*)::int n from information_schema.role_table_grants
    where table_schema = 'public' and grantee in ('anon', 'authenticated')`;

  console.log("Status akhir:");
  for (const t of tables) {
    console.log(`  ${t.tablename.padEnd(18)} RLS: ${t.rowsecurity ? "AKTIF" : "MATI"}`);
  }
  console.log(`  hak anon/authenticated tersisa: ${grants[0].n} (harus 0)`);

  await sql.end();
}

main().catch((err) => {
  console.error("✗ Gagal:", err);
  process.exit(1);
});
