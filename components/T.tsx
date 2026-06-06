"use client";

import { useLang } from "@/context/LanguageContext";

// Komponen kecil untuk menerjemahkan teks di dalam Server Component sekalipun
// (karena ini Client Component). Pemakaian: <T k="nav.catalog" />
export default function T({
  k,
  vars,
}: {
  k: string;
  vars?: Record<string, string | number>;
}) {
  const { t } = useLang();
  return <>{t(k, vars)}</>;
}
