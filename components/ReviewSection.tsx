"use client";

import { useState } from "react";
import { RatingDisplay, RatingInput } from "./RatingStars";
import type { Review } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReviewSection({
  productId,
  initialReviews,
  initialAverage,
}: {
  productId: string;
  initialReviews: Review[];
  initialAverage: number;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  // Umpan bot (honeypot) — pengguna asli selalu membiarkannya kosong.
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const average =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length) * 10
        ) / 10
      : initialAverage;

  // Distribusi bintang.
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.rating === star).length,
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Pilih rating bintang dulu.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          name,
          rating,
          comment,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim ulasan.");
      if (data.review) setReviews((prev) => [data.review, ...prev]);
      setName("");
      setRating(0);
      setComment("");
      setShowForm(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <section id="ulasan" className="container-content py-12 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-extrabold text-slate-900">
        Ulasan Produk
      </h2>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Ringkasan */}
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-slate-900">
              {average > 0 ? average.toFixed(1) : "—"}
            </span>
            <div className="pb-1">
              <RatingDisplay value={average} showCount={false} />
              <p className="text-xs text-slate-500">{reviews.length} ulasan</p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{d.star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-accent-500"
                    style={{
                      width: reviews.length
                        ? `${(d.n / reviews.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="w-4 text-right text-slate-400">{d.n}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="btn-primary mt-5 w-full text-sm"
          >
            Tulis Ulasan
          </button>
          {done && (
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700">
              Terima kasih atas ulasanmu!
            </p>
          )}
        </div>

        {/* Daftar + form */}
        <div>
          {showForm && (
            <form
              onSubmit={submit}
              className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              {/* Honeypot: tak terlihat & tak terjangkau pengguna maupun
                  pembaca layar — hanya bot pengisi-otomatis yang mengisinya. */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />
              <div className="mb-3">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Rating *
                </label>
                <RatingInput value={rating} onChange={setRating} />
              </div>
              <div className="mb-3">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nama *
                </label>
                <input
                  className={input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                />
              </div>
              <div className="mb-3">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Ulasan *
                </label>
                <textarea
                  className={input}
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bagikan pengalamanmu memakai produk ini…"
                />
              </div>
              {error && (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                  {saving ? "Mengirim…" : "Kirim Ulasan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              Belum ada ulasan. Jadilah yang pertama memberi ulasan!
            </div>
          ) : (
            <ul className="space-y-5">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-slate-100 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {r.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {r.name}
                        </p>
                        <RatingDisplay value={r.rating} size={13} showCount={false} />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {r.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
