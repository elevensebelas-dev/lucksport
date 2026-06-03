"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatIDR } from "@/lib/products";
import { SearchIcon } from "./Icons";

interface Suggestion {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function SearchAutocomplete({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounce fetch suggestions.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  // Tutup saat klik di luar.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/produk/${slug}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && results[active]) {
      go(results[active].slug);
      return;
    }
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/katalog?q=${encodeURIComponent(q)}` : "/katalog");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Cari produk..."
          className="w-44 rounded-full border border-slate-300 bg-slate-50 py-2 pl-4 pr-10 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 lg:w-64"
          aria-label="Cari produk"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600"
          aria-label="Cari"
        >
          <SearchIcon width={18} height={18} />
        </button>
      </form>

      {open && (results.length > 0 || (!loading && query.trim().length >= 2)) && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">
              Tidak ada hasil untuk “{query.trim()}”.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.slug)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                      i === active ? "bg-brand-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image src={r.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">
                        {r.name}
                      </span>
                      <span className="text-xs text-slate-400">{r.category}</span>
                    </span>
                    <span className="text-sm font-semibold text-brand-700">
                      {formatIDR(r.price)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
