import Link from "next/link";
import Logo from "./Logo";
import T from "./T";
import { STORE } from "@/lib/config";
import { CATEGORIES } from "@/lib/products";
import { CATEGORY_CONTENT } from "@/lib/categories";
import { WhatsAppIcon } from "./Icons";

// Kategori yang punya halaman SEO sendiri.
const CATEGORY_SEO_SLUGS = new Set(CATEGORY_CONTENT.map((c) => c.slug));

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="container-content grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-600">
            <T k="footer.tagline" />
          </p>
          <a
            href={STORE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
            </svg>
            @{STORE.instagram}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            <T k="footer.categories" />
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                {/* Mengarah ke halaman kategori (/kayak, /kano, …) bila ada —
                    bukan /katalog?kategori=…, agar halaman SEO itu tertaut
                    dari setiap halaman dan mudah ditemukan mesin pencari. */}
                <Link
                  href={
                    CATEGORY_SEO_SLUGS.has(c.slug)
                      ? `/${c.slug}`
                      : `/katalog?kategori=${c.slug}`
                  }
                  className="text-slate-600 hover:text-brand-600"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            <T k="footer.info" />
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/tentang-kami" className="text-slate-600 hover:text-brand-600">
                <T k="nav.about" />
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-slate-600 hover:text-brand-600">
                <T k="nav.faq" />
              </Link>
            </li>
            <li>
              <Link href="/kebijakan" className="text-slate-600 hover:text-brand-600">
                <T k="footer.terms" />
              </Link>
            </li>
            <li>
              <Link href="/katalog" className="text-slate-600 hover:text-brand-600">
                <T k="nav.catalog" />
              </Link>
            </li>
            <li>
              <Link href="/promo" className="text-slate-600 hover:text-brand-600">
                <T k="footer.promo" />
              </Link>
            </li>
            <li>
              <Link href="/pesanan" className="text-slate-600 hover:text-brand-600">
                <T k="footer.orders" />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            <T k="footer.cs" />
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>{STORE.operationalDays}</li>
            <li>{STORE.operationalHours}</li>
            <li>{STORE.email}</li>
          </ul>
          <a
            href={`https://wa.me/${STORE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4 w-full"
          >
            <WhatsAppIcon width={18} height={18} />
            <T k="footer.chatCs" />
          </a>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Luck Sport — <T k="footer.rights" /></p>
          <div className="flex gap-4">
            <Link href="/kebijakan" className="hover:text-brand-600">
              <T k="footer.privacy" />
            </Link>
            <Link href="/kebijakan" className="hover:text-brand-600">
              <T k="footer.terms" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
