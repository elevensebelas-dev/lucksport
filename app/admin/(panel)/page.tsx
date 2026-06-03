import type { Metadata } from "next";
import AdminClient from "@/components/admin/AdminClient";
import { getAllProductsAdmin } from "@/lib/store";
import { totalStock, formatIDR } from "@/lib/products";
import { getAllReviews } from "@/lib/reviews";
import { getAllRestock } from "@/lib/restock";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const products = getAllProductsAdmin();
  const reviews = getAllReviews();
  const restock = getAllRestock();

  const active = products.filter((p) => p.is_active).length;
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * totalStock(p),
    0
  );
  const lowStock = products.filter((p) => {
    const s = totalStock(p);
    return s > 0 && s <= 5;
  });
  const outOfStock = products.filter((p) => totalStock(p) === 0);
  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

  // Breakdown per kategori.
  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...categories.map(([, n]) => n));

  const stats = [
    { label: "Total Produk", value: products.length, sub: `${active} aktif` },
    {
      label: "Nilai Inventaris",
      value: formatIDR(inventoryValue),
      sub: "harga × stok",
    },
    {
      label: "Stok Menipis",
      value: lowStock.length,
      sub: `${outOfStock.length} habis`,
      alert: lowStock.length > 0 || outOfStock.length > 0,
    },
    {
      label: "Rating Rata-rata",
      value: avgRating > 0 ? `${avgRating} ★` : "—",
      sub: `${reviews.length} ulasan`,
    },
    {
      label: "Permintaan Restock",
      value: restock.length,
      sub: "menunggu tindak lanjut",
      alert: restock.length > 0,
    },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ringkasan katalog & aktivitas toko Lucksport.
      </p>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Penting:</strong> Anda login dengan password default. Ganti{" "}
        <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> &amp;{" "}
        <code className="rounded bg-amber-100 px-1">AUTH_SECRET</code> di{" "}
        <code className="rounded bg-amber-100 px-1">.env.local</code> sebelum
        go-live.
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border bg-white p-4 ${
              s.alert ? "border-amber-300" : "border-slate-200"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
            <p
              className={`mt-1 text-2xl font-extrabold ${
                s.alert ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {s.value}
            </p>
            <p className="text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Breakdown kategori */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
            Produk per Kategori
          </h2>
          <div className="space-y-3">
            {categories.map(([cat, n]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-700">{cat}</span>
                  <span className="font-medium text-slate-900">{n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(n / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stok menipis / habis */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
            Perlu Perhatian Stok
          </h2>
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="text-sm text-slate-500">
              Semua produk memiliki stok yang sehat. 👍
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {[...outOfStock, ...lowStock].slice(0, 8).map((p) => {
                const s = totalStock(p);
                return (
                  <li
                    key={p.product_id}
                    className="flex items-center justify-between border-b border-slate-100 pb-2"
                  >
                    <span className="text-slate-700">{p.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        s === 0
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s === 0 ? "Habis" : `Sisa ${s}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Manajemen produk */}
      <AdminClient initial={products} />
    </div>
  );
}
