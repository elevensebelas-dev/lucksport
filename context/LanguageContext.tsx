"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANG, translate, type Lang } from "@/lib/i18n";

// Cookie bahasa: sumber kebenaran tunggal, bisa dibaca server (SSR) maupun
// middleware. Nilai awal datang dari server via prop initialLang.
const LANG_COOKIE = "lucksport_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  // Mulai dari bahasa yang sudah ditentukan server → render client cocok
  // dengan HTML server (tanpa kedipan, tanpa hydration mismatch).
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Persist pilihan ke cookie + sinkron atribut <html lang> setiap berubah.
  useEffect(() => {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LangContextValue = {
    lang,
    setLang: setLangState,
    toggle: () => setLangState((l) => (l === "id" ? "en" : "id")),
    t: (key, vars) => translate(lang, key, vars),
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang harus dipakai di dalam LanguageProvider");
  return ctx;
}
