import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-extrabold tracking-tight ${className}`}
      aria-label="Lucksport beranda"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        {/* Mark: lightning bolt = energi/sporty */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />
        </svg>
      </span>
      <span className="text-xl text-slate-900">
        Luck<span className="text-brand-600">sport</span>
      </span>
    </Link>
  );
}
