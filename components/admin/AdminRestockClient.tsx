"use client";

import { useState } from "react";
import { TrashIcon } from "@/components/Icons";
import type { RestockRequest } from "@/lib/types";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Bedakan kontak WA vs email untuk tombol aksi cepat.
function contactLink(contact: string): string | null {
  const c = contact.trim();
  if (c.includes("@")) return `mailto:${c}`;
  const digits = c.replace(/[^0-9]/g, "");
  if (digits.length >= 8) {
    const intl = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
    return `https://wa.me/${intl}`;
  }
  return null;
}

export default function AdminRestockClient({
  initial,
}: {
  initial: RestockRequest[];
}) {
  const [items, setItems] = useState<RestockRequest[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Hapus permintaan ini?")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/restock/${id}`, { method: "DELETE" });
      if (res.ok) setItems((list) => list.filter((x) => x.id !== id));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">
        Permintaan Notifikasi Stok
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        {items.length} pelanggan menunggu kabar stok kembali. Hubungi mereka saat
        produk tersedia, lalu hapus dari daftar.
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          Belum ada permintaan.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((r) => {
                const link = contactLink(r.contact);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {r.product_name}
                    </td>
                    <td className="px-4 py-3">
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {r.contact}
                        </a>
                      ) : (
                        <span className="text-slate-600">{r.contact}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {fmt(r.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => remove(r.id)}
                          disabled={busy === r.id}
                          className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                          aria-label="Hapus"
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
