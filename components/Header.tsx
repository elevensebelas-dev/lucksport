"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchAutocomplete from "./SearchAutocomplete";
import {
  CartIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
  ChatIcon,
  HeartIcon,
} from "./Icons";

// Buka chatbot mengambang dari mana pun (lihat ChatBot.tsx).
const openChat = () =>
  window.dispatchEvent(new Event("lucksport:open-chat"));

const NAV = [
  { href: "/katalog", label: "Katalog" },
  { href: "/promo", label: "Promo" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Tutup menu mobile saat pindah halaman.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/katalog?q=${encodeURIComponent(q)}` : "/katalog");
    setSearchOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-content flex h-16 items-center gap-4">
        {/* Mobile: hamburger */}
        <button
          className="text-slate-700 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu"
        >
          <MenuIcon />
        </button>

        <Logo />

        {/* Desktop nav */}
        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                  active ? "text-brand-600" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Desktop search dengan autocomplete */}
          <SearchAutocomplete className="hidden md:block" />

          {/* Mobile search toggle */}
          <button
            className="p-2 text-slate-700 hover:text-brand-600 md:hidden"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Cari produk"
          >
            <SearchIcon width={22} height={22} />
          </button>

          {/* Chatbot button */}
          <button
            onClick={openChat}
            className="hidden items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            <ChatIcon width={18} height={18} />
            Chat
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 text-slate-700 hover:text-brand-600"
            aria-label={`Favorit, ${wishCount} item`}
          >
            <HeartIcon width={24} height={24} />
            {wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 text-slate-700 hover:text-brand-600"
            aria-label={`Keranjang, ${count} item`}
          >
            <CartIcon width={24} height={24} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="border-t border-slate-200 p-3 md:hidden">
          <form onSubmit={submitSearch} role="search" className="relative">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-4 pr-11 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
              aria-label="Cari produk"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-label="Cari"
            >
              <SearchIcon width={18} height={18} />
            </button>
          </form>
        </div>
      )}

      </header>

      {/* Mobile drawer — di luar <header> agar tidak terkurung backdrop-filter
          (backdrop-filter membuat containing block untuk elemen fixed). */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 w-72 max-w-[80%] animate-slide-in rounded-br-2xl bg-white p-5 pb-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu"
                className="text-slate-600"
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => {
                setMobileOpen(false);
                openChat();
              }}
              className="btn-primary mt-6 w-full"
            >
              <ChatIcon width={18} height={18} />
              Chat dengan Asisten
            </button>
          </div>
        </div>
      )}
    </>
  );
}
