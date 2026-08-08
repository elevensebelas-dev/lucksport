"use client";

import { useLang } from "@/context/LanguageContext";

/**
 * Menampilkan teks sesuai bahasa aktif, tanpa perlu kunci i18n.
 *
 * Berguna untuk konten panjang & unik per halaman (mis. paragraf dan FAQ
 * halaman kategori) yang tidak layak dijejalkan sebagai ratusan kunci di
 * lib/i18n.ts. Untuk teks antarmuka yang dipakai berulang, tetap gunakan <T />.
 */
export default function LangText({ id, en }: { id: string; en: string }) {
  const { lang } = useLang();
  return <>{lang === "en" ? en : id}</>;
}
