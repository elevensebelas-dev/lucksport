"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANG, translate, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "lucksport_lang";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Muat preferensi bahasa.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "id" || saved === "en") setLangState(saved);
    } catch {
      /* abaikan */
    }
  }, []);

  // Simpan + update atribut <html lang>.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* abaikan */
    }
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
