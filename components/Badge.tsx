import type { Badge as BadgeType } from "@/lib/types";

const STYLES: Record<BadgeType, { label: string; className: string }> = {
  new: { label: "Baru", className: "bg-brand-600 text-white" },
  best_seller: { label: "Terlaris", className: "bg-accent-500 text-white" },
  sale: { label: "Diskon", className: "bg-red-500 text-white" },
};

export default function Badge({ type }: { type: BadgeType }) {
  const s = STYLES[type];
  return <span className={`badge ${s.className}`}>{s.label}</span>;
}

// Persentase diskon untuk ditampilkan di label sale.
export function discountPercent(price: number, original: number): number {
  return Math.round(((original - price) / original) * 100);
}
