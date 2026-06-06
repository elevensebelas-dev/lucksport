"use client";

import { useLang } from "@/context/LanguageContext";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-300 p-0.5 text-xs font-bold ${className}`}
      role="group"
      aria-label="Pilih bahasa / Choose language"
    >
      {(["id", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === l
              ? "bg-brand-600 text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
