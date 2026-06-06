"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { FilterIcon, CloseIcon, SearchIcon, ChevronDown } from "./Icons";
import { useLang } from "@/context/LanguageContext";
import { totalStock } from "@/lib/products";
import type { Product, Category } from "@/lib/types";

const CATEGORY_OPTIONS: Category[] = ["Perahu"];

const PRICE_RANGES = [
  { label: "< Rp150rb", min: 0, max: 150000 },
  { label: "Rp150rb – Rp300rb", min: 150000, max: 300000 },
  { label: "Rp300rb – Rp500rb", min: 300000, max: 500000 },
  { label: "> Rp500rb", min: 500000, max: Infinity },
];

type SortKey = "terbaru" | "termurah" | "termahal" | "terpopuler";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "terbaru", label: "catalog.sort.newest" },
  { key: "termurah", label: "catalog.sort.cheapest" },
  { key: "termahal", label: "catalog.sort.expensive" },
  { key: "terpopuler", label: "catalog.sort.popular" },
];

const categorySlugMap: Record<string, Category> = {
  jersey: "Jersey",
  sepatu: "Sepatu",
  celana: "Celana",
  aksesori: "Aksesori",
  perahu: "Perahu",
};

// popularitas didekati dari badge best_seller lalu jumlah stok.
function popularityScore(p: Product) {
  return (p.badges.includes("best_seller") ? 1000 : 0) + totalStock(p);
}

export default function CatalogClient({
  products,
  summaries = {},
}: {
  products: Product[];
  summaries?: Record<string, { average: number; count: number }>;
}) {
  const { t } = useLang();
  const params = useSearchParams();
  const initialCategory = params.get("kategori");
  const initialQuery = params.get("q") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialCategory && categorySlugMap[initialCategory]
      ? [categorySlugMap[initialCategory]]
      : []
  );
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sinkronkan jika URL berubah (mis. klik kategori dari footer/hero).
  useEffect(() => {
    const cat = params.get("kategori");
    setSelectedCategories(
      cat && categorySlugMap[cat] ? [categorySlugMap[cat]] : []
    );
    setQuery(params.get("q") ?? "");
  }, [params]);

  const filtered = useMemo(() => {
    let list = products.slice();

    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedPrices.length) {
      list = list.filter((p) =>
        selectedPrices.some((idx) => {
          const r = PRICE_RANGES[idx];
          return p.price >= r.min && p.price < r.max;
        })
      );
    }
    if (inStockOnly) {
      list = list.filter((p) => totalStock(p) > 0);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "termurah":
        list.sort((a, b) => a.price - b.price);
        break;
      case "termahal":
        list.sort((a, b) => b.price - a.price);
        break;
      case "terpopuler":
        list.sort((a, b) => popularityScore(b) - popularityScore(a));
        break;
      default: // terbaru
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
    return list;
  }, [products, selectedCategories, selectedPrices, inStockOnly, query, sort]);

  function toggleCategory(c: Category) {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }
  function togglePrice(idx: number) {
    setSelectedPrices((prev) =>
      prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
    );
  }
  function resetFilters() {
    setSelectedCategories([]);
    setSelectedPrices([]);
    setInStockOnly(false);
    setQuery("");
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedPrices.length > 0 ||
    inStockOnly ||
    query.trim().length > 0;

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          {t("catalog.category")}
        </h3>
        <ul className="space-y-2">
          {CATEGORY_OPTIONS.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggleCategory(c)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {c}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          {t("catalog.price")}
        </h3>
        <ul className="space-y-2">
          {PRICE_RANGES.map((r, idx) => (
            <li key={r.label}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(idx)}
                  onChange={() => togglePrice(idx)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {r.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          {t("catalog.availability")}
        </h3>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          {t("catalog.inStockOnly")}
        </label>
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {t("catalog.reset")}
        </button>
      )}
    </div>
  );

  return (
    <div className="container-content py-8 lg:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">{t("catalog.title")}</h1>
        <p className="mt-1 text-slate-600">{t("catalog.subtitle")}</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          className="w-full rounded-full border border-slate-300 bg-white py-3 pl-5 pr-12 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          aria-label={t("common.search")}
        />
        <SearchIcon
          width={20}
          height={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      <div className="flex gap-8">
        {/* Sidebar filter (desktop) */}
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <div className="sticky top-20">{FilterPanel}</div>
        </aside>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {t("catalog.showing", { x: filtered.length, y: products.length })}
            </p>

            <div className="flex items-center gap-2">
              {/* Filter button mobile */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="btn-outline px-3 py-2 text-sm lg:hidden"
              >
                <FilterIcon width={18} height={18} /> {t("catalog.filter")}
                {hasFilters && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-accent-500" />
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
                  aria-label={t("catalog.sortBy")}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {t(o.label)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  width={16}
                  height={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-20 text-center">
              <p className="text-lg font-semibold text-slate-700">
                {t("catalog.empty.title")}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {t("catalog.empty.desc")}
              </p>
              {hasFilters && (
                <button onClick={resetFilters} className="btn-primary mt-4">
                  {t("catalog.reset")}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard
                  key={p.product_id}
                  product={p}
                  rating={summaries[p.product_id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{t("catalog.filter")}</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                aria-label={t("catalog.filter")}
                className="text-slate-500"
              >
                <CloseIcon />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              {t("catalog.showN", { x: filtered.length })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
