"use client";

import { useState } from "react";
import { RatingDisplay } from "@/components/RatingStars";
import { TrashIcon } from "@/components/Icons";
import type { Review } from "@/lib/types";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminReviewsClient({
  initial,
  productNames,
}: {
  initial: Review[];
  productNames: Record<string, string>;
}) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(r: Review) {
    setBusy(r.id);
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !r.approved }),
      });
      if (res.ok)
        setReviews((list) =>
          list.map((x) =>
            x.id === r.id ? { ...x, approved: !x.approved } : x
          )
        );
    } finally {
      setBusy(null);
    }
  }

  async function remove(r: Review) {
    if (!confirm("Hapus ulasan ini?")) return;
    setBusy(r.id);
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, {
        method: "DELETE",
      });
      if (res.ok) setReviews((list) => list.filter((x) => x.id !== r.id));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">
        Moderasi Ulasan
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        {reviews.length} ulasan. Sembunyikan untuk menghapusnya dari tampilan
        toko tanpa menghapus permanen.
      </p>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          Belum ada ulasan.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border bg-white p-4 ${
                r.approved ? "border-slate-200" : "border-slate-200 opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{r.name}</span>
                    <RatingDisplay value={r.rating} size={14} showCount={false} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {productNames[r.product_id] ?? "Produk dihapus"} · {fmt(r.created_at)}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggle(r)}
                    disabled={busy === r.id}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      r.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {r.approved ? "Tampil" : "Disembunyikan"}
                  </button>
                  <button
                    onClick={() => remove(r)}
                    disabled={busy === r.id}
                    className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                    aria-label="Hapus ulasan"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
