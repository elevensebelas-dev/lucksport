"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/ulasan", label: "Ulasan" },
  { href: "/admin/restock", label: "Notif Stok" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-4">
      <nav className="hidden items-center gap-1 sm:flex">
        {LINKS.map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-100 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        target="_blank"
        className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 md:inline"
      >
        Lihat Website →
      </Link>
      <LogoutButton />
    </div>
  );
}
