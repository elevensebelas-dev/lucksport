"use client";

import { useLang } from "@/context/LanguageContext";

export default function LanguageSwitcher({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 text-xs font-bold transition-colors ${
        dark ? "border-white/40" : "border-slate-300"
      } ${className}`}
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
              ? dark
                ? "bg-white text-slate-900"
                : "bg-brand-600 text-white"
              : dark
              ? "text-white/70 hover:text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
