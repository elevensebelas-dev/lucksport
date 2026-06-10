"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { formatIDR, isCallForPriceCategory } from "@/lib/products";
import type { Product, Category, Badge, Variant } from "@/lib/types";
import { CloseIcon, PlusIcon, TrashIcon } from "@/components/Icons";

const CATEGORIES: Category[] = [
  "Kayak",
  "Kano",
  "Perahu Karet",
  "SUP",
  "Lainnya",
];
const BADGES: { key: Badge; label: string }[] = [
  { key: "new", label: "Baru" },
  { key: "best_seller", label: "Terlaris" },
  { key: "sale", label: "Diskon" },
];

interface Props {
  initial?: Product;
  onSaved: (p: Product) => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  category: Category;
  description: string;
  model3d: string;
  price: string;
  price_original: string;
  images: string[];
  variants: Variant[];
  badges: Badge[];
  is_active: boolean;
}

function toState(p?: Product): FormState {
  return {
    name: p?.name ?? "",
    category: p?.category ?? "Kayak",
    description: p?.description ?? "",
    model3d: p?.model3d ?? "",
    price: p ? String(p.price) : "",
    price_original: p?.price_original != null ? String(p.price_original) : "",
    images: p?.images ?? [],
    variants: p?.variants ? p.variants.map((v) => ({ ...v })) : [{ size: "", color: "", stock: 0 }],
    badges: p?.badges ?? [],
    is_active: p?.is_active ?? true,
  };
}

export default function AdminProductForm({ initial, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(toState(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // Instagram helper
  const [igOpen, setIgOpen] = useState(false);
  const [igCaption, setIgCaption] = useState("");

  // bulk variant generator
  const [bulkSizes, setBulkSizes] = useState("");
  const [bulkColors, setBulkColors] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const [uploadingModel, setUploadingModel] = useState(false);

  function patch(p: Partial<FormState>) {
    setForm((f) => ({ ...f, ...p }));
  }

  // ── Upload model 3D (.glb/.gltf) ──
  async function uploadModel(file: File | null | undefined) {
    if (!file) return;
    setUploadingModel(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah model 3D.");
      patch({ model3d: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah model.");
    } finally {
      setUploadingModel(false);
      if (modelRef.current) modelRef.current.value = "";
    }
  }

  // ── Upload foto ──
  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengunggah foto.");
        urls.push(data.url);
      }
      patch({ images: [...form.images, ...urls].slice(0, 8) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const u = urlInput.trim();
    if (!u) return;
    patch({ images: [...form.images, u].slice(0, 8) });
    setUrlInput("");
  }

  function removeImage(i: number) {
    patch({ images: form.images.filter((_, idx) => idx !== i) });
  }

  // ── Varian ──
  function updateVariant(i: number, p: Partial<Variant>) {
    patch({
      variants: form.variants.map((v, idx) => (idx === i ? { ...v, ...p } : v)),
    });
  }
  function addVariant() {
    patch({ variants: [...form.variants, { size: "", color: "", stock: 0 }] });
  }
  function removeVariant(i: number) {
    patch({ variants: form.variants.filter((_, idx) => idx !== i) });
  }
  function generateVariants() {
    const sizes = bulkSizes.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = bulkColors.split(",").map((s) => s.trim()).filter(Boolean);
    if (!sizes.length || !colors.length) return;
    const generated: Variant[] = [];
    for (const color of colors)
      for (const size of sizes) generated.push({ size, color, stock: 0 });
    // gabung dengan yang sudah ada (hindari duplikat)
    const existing = form.variants.filter((v) => v.size && v.color);
    const merged = [...existing];
    for (const g of generated) {
      if (!merged.some((v) => v.size === g.size && v.color === g.color))
        merged.push(g);
    }
    patch({ variants: merged });
    setBulkSizes("");
    setBulkColors("");
  }

  function toggleBadge(b: Badge) {
    patch({
      badges: form.badges.includes(b)
        ? form.badges.filter((x) => x !== b)
        : [...form.badges, b],
    });
  }

  // ── Isi dari caption Instagram ──
  function applyCaption() {
    const text = igCaption.trim();
    if (!text) return;
    const lines = text.split("\n").map((l) => l.trim());
    const firstLine = lines.find((l) => l.length > 0) ?? "";
    // Deteksi harga: pola "Rp150.000", "150rb", "150k", "Rp 150,000"
    let price = form.price;
    const rpMatch = text.match(/rp\s?([\d.,]+)/i);
    const rbMatch = text.match(/(\d+)\s?(?:rb|ribu|k)\b/i);
    if (rpMatch) {
      const n = parseInt(rpMatch[1].replace(/[.,]/g, ""), 10);
      if (Number.isFinite(n)) price = String(n);
    } else if (rbMatch) {
      const n = parseInt(rbMatch[1], 10) * 1000;
      if (Number.isFinite(n)) price = String(n);
    }
    // Deskripsi: buang baris pertama (nama), hashtag, dan baris harga.
    const priceLine = /(?:^|\b)(?:harga\s*:?\s*)?(?:rp\s?[\d.,]+|\d+\s?(?:rb|ribu|k)\b)/i;
    const desc = lines
      .filter(
        (l) =>
          l &&
          !/^#/.test(l) &&
          l !== firstLine &&
          !(priceLine.test(l) && l.replace(priceLine, "").replace(/[.,\s]/g, "").length < 3)
      )
      .map((l) => l.replace(/#[^\s#]+/g, "").trim())
      .filter(Boolean)
      .join("\n")
      .trim();
    // Tebak kategori dari kata kunci
    const lower = text.toLowerCase();
    let category = form.category;
    if (/kayak|k1|k2|k4|slalom/.test(lower)) category = "Kayak";
    else if (/kano|canoe|c1|c2|outrigger/.test(lower)) category = "Kano";
    else if (/perahu karet|inflatable|lcr|karet|rescue/.test(lower)) category = "Perahu Karet";
    else if (/sup|paddle board|stand-up|stand up/.test(lower)) category = "SUP";

    patch({
      name: firstLine.replace(/#[^\s#]+/g, "").slice(0, 80).trim() || form.name,
      description: desc || form.description,
      price,
      category,
    });
    setIgOpen(false);
  }

  // ── Submit ──
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      model3d: form.model3d,
      price: Number(form.price),
      price_original: form.price_original ? Number(form.price_original) : null,
      images: form.images,
      variants: form.variants
        .filter((v) => v.size.trim() && v.color.trim())
        .map((v) => ({ ...v, stock: Number(v.stock) || 0 })),
      badges: form.badges,
      is_active: form.is_active,
    };

    setSaving(true);
    try {
      const res = await fetch(
        initial ? `/api/products/${initial.product_id}` : "/api/products",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan produk.");
      onSaved(data.product);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  const label = "block text-sm font-semibold text-slate-700 mb-1.5";
  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Instagram helper */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
        <button
          type="button"
          onClick={() => setIgOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-brand-800"
        >
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
            </svg>
            Isi cepat dari caption Instagram
          </span>
          <span className="text-xs text-brand-600">{igOpen ? "Tutup" : "Buka"}</span>
        </button>
        {igOpen && (
          <div className="mt-3">
            <textarea
              value={igCaption}
              onChange={(e) => setIgCaption(e.target.value)}
              rows={4}
              placeholder={"Tempel caption postingan IG di sini...\nContoh:\nJersey Pro Elite Home\nBahan dri-fit adem, ready stok!\nHarga Rp189.000\n#lucksport #jersey"}
              className={input}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Kami coba isi otomatis nama, deskripsi, harga & kategori. Foto, ukuran,
              dan stok tetap diisi manual di bawah.
            </p>
            <button
              type="button"
              onClick={applyCaption}
              className="btn-primary mt-2 px-4 py-2 text-sm"
            >
              Isi Otomatis
            </button>
          </div>
        )}
      </div>

      {/* Nama & kategori */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Nama Produk *</label>
          <input
            className={input}
            value={form.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Jersey Pro Elite Home"
          />
        </div>
        <div>
          <label className={label}>Kategori *</label>
          <select
            className={input}
            value={form.category}
            onChange={(e) => patch({ category: e.target.value as Category })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Harga */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>
            Harga Jual (IDR){" "}
            {isCallForPriceCategory(form.category) ? "(opsional)" : "*"}
          </label>
          <input
            type="number"
            className={input}
            value={form.price}
            onChange={(e) => patch({ price: e.target.value })}
            placeholder="189000"
            min={0}
          />
          {isCallForPriceCategory(form.category) ? (
            <p className="mt-1 text-xs text-amber-600">
              Kategori &quot;{form.category}&quot;: harga tidak ditampilkan di
              website (pelanggan diarahkan ke tombol &quot;Call CS&quot;). Boleh
              dikosongkan.
            </p>
          ) : (
            form.price && (
              <p className="mt-1 text-xs text-slate-500">
                {formatIDR(Number(form.price) || 0)}
              </p>
            )
          )}
        </div>
        <div>
          <label className={label}>Harga Sebelum Diskon (opsional)</label>
          <input
            type="number"
            className={input}
            value={form.price_original}
            onChange={(e) => patch({ price_original: e.target.value })}
            placeholder="249000"
            min={0}
          />
          <p className="mt-1 text-xs text-slate-500">
            Isi jika produk diskon (harga akan dicoret).
          </p>
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className={label}>Deskripsi</label>
        <textarea
          className={input}
          rows={4}
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="Bahan, teknologi, kegunaan..."
        />
      </div>

      {/* Foto */}
      <div>
        <label className={label}>Foto Produk * (maks. 8)</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            uploadFiles(e.dataTransfer.files);
          }}
          className="rounded-xl border-2 border-dashed border-slate-300 p-4 text-center"
        >
          {form.images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {form.images.map((src, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                    aria-label="Hapus foto"
                  >
                    <CloseIcon width={14} height={14} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-brand-600/90 py-0.5 text-[10px] font-semibold text-white">
                      Utama
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || form.images.length >= 8}
            className="btn-outline px-4 py-2 text-sm"
          >
            {uploading ? "Mengunggah…" : "Pilih / Tarik Foto ke sini"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG, WebP — maks 8MB. Foto pertama jadi foto utama.
          </p>
        </div>
        {/* Tambah via URL (mis. salin dari sumber lain) */}
        <div className="mt-2 flex gap-2">
          <input
            className={input}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="atau tempel URL gambar…"
          />
          <button type="button" onClick={addUrl} className="btn-outline whitespace-nowrap px-3 py-2 text-sm">
            Tambah URL
          </button>
        </div>
      </div>

      {/* Model 3D */}
      <div>
        <label className={label}>Model 3D (.glb / .gltf) — opsional</label>
        <div className="rounded-xl border-2 border-dashed border-slate-300 p-4">
          {form.model3d ? (
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="flex-shrink-0 text-brand-600">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <span className="truncate">{form.model3d.split("/").pop()}</span>
              </span>
              <button
                type="button"
                onClick={() => patch({ model3d: "" })}
                className="flex-shrink-0 text-sm font-medium text-red-500 hover:text-red-600"
              >
                Hapus
              </button>
            </div>
          ) : (
            <div className="text-center">
              <input
                ref={modelRef}
                type="file"
                accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                className="hidden"
                onChange={(e) => uploadModel(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => modelRef.current?.click()}
                disabled={uploadingModel}
                className="btn-outline px-4 py-2 text-sm"
              >
                {uploadingModel ? "Mengunggah…" : "Unggah Model 3D"}
              </button>
              <p className="mt-2 text-xs text-slate-500">
                Format .glb/.gltf, maks 40MB. Tampil sebagai 3D viewer interaktif
                di halaman produk.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Varian */}
      <div>
        <label className={label}>Varian — Ukuran, Warna & Stok (SKU) *</label>

        {/* Bulk generator */}
        <div className="mb-3 flex flex-wrap items-end gap-2 rounded-lg bg-slate-50 p-3">
          <div className="flex-1 min-w-[120px]">
            <span className="mb-1 block text-xs text-slate-500">Ukuran (pisah koma)</span>
            <input className={input} value={bulkSizes} onChange={(e) => setBulkSizes(e.target.value)} placeholder="S, M, L, XL" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <span className="mb-1 block text-xs text-slate-500">Warna (pisah koma)</span>
            <input className={input} value={bulkColors} onChange={(e) => setBulkColors(e.target.value)} placeholder="Merah, Biru" />
          </div>
          <button type="button" onClick={generateVariants} className="btn-outline px-3 py-2 text-sm">
            Buat Varian
          </button>
        </div>

        <div className="space-y-2">
          {form.variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={input}
                value={v.size}
                onChange={(e) => updateVariant(i, { size: e.target.value })}
                placeholder="Ukuran (mis. M)"
              />
              <input
                className={input}
                value={v.color}
                onChange={(e) => updateVariant(i, { color: e.target.value })}
                placeholder="Warna (mis. Merah)"
              />
              <input
                type="number"
                className={`${input} w-24`}
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                placeholder="Stok"
                min={0}
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500"
                aria-label="Hapus varian"
              >
                <TrashIcon width={18} height={18} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariant} className="btn-outline mt-2 px-3 py-2 text-sm">
          <PlusIcon width={16} height={16} /> Tambah Varian
        </button>
      </div>

      {/* Badge & status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Label / Badge</label>
          <div className="flex flex-wrap gap-3">
            {BADGES.map((b) => (
              <label key={b.key} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.badges.includes(b.key)}
                  onChange={() => toggleBadge(b.key)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {b.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={label}>Status</label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => patch({ is_active: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Aktif (tampil di website)
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3 border-t border-slate-200 pt-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Batal
        </button>
      </div>
    </form>
  );
}
