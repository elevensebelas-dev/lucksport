"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons";
import type { Product } from "@/lib/types";

// Form notifikasi stok kembali (PRD §9 Fase 3) — tampil saat produk habis.
export default function RestockForm({ product }: { product: Product }) {
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!contact.trim()) {
      setError("Isi nomor WhatsApp atau email Anda.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.product_id,
          product_name: product.name,
          contact,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar.");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
        <CheckIcon width={18} height={18} />
        Siap! Kami akan mengabari Anda saat {product.name} tersedia kembali.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <p className="text-sm font-semibold text-slate-800">
        Stok habis — mau dikabari saat tersedia lagi?
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Nomor WhatsApp atau email"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button type="submit" disabled={saving} className="btn-primary text-sm">
          {saving ? "Mendaftar…" : "Kabari Saya"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
