"use client";

import { useId } from "react";

// Tampilan & input rating bintang (PRD §9 Fase 3).

function Star({
  fill,
  size = 16,
}: {
  fill: "full" | "half" | "empty";
  size?: number;
}) {
  // useId menghasilkan id stabil di server & client (hindari hydration mismatch).
  const id = `half-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
      )}
      <path
        d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          fill === "full" ? "#f59e0b" : fill === "half" ? `url(#${id})` : "#e2e8f0"
        }
      />
    </svg>
  );
}

// Tampilan rata-rata rating (read-only).
export function RatingDisplay({
  value,
  count,
  size = 16,
  showCount = true,
}: {
  value: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            fill={value >= i ? "full" : value >= i - 0.5 ? "half" : "empty"}
          />
        ))}
      </span>
      {showCount && (
        <span className="text-xs text-slate-500">
          {value > 0 ? value.toFixed(1) : "Belum ada"}
          {count != null && count > 0 && ` (${count})`}
        </span>
      )}
    </span>
  );
}

// Input rating bintang (interaktif).
export function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} bintang`}
          className="transition-transform hover:scale-110"
        >
          <Star size={28} fill={value >= i ? "full" : "empty"} />
        </button>
      ))}
    </div>
  );
}
