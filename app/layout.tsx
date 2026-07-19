import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Analytics from "@/components/Analytics";
import { STORE, SITE_URL } from "@/lib/config";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Font display elegan untuk judul besar (pengalaman award homepage).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const DESCRIPTION =
  "Lucksport — perajin perahu di Danau Jatiluhur, Purwakarta. Kayak, kano, " +
  "perahu karet, dan paddle board buatan tangan. Konsultasi & pemesanan cepat via WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE.name} — ${STORE.tagline}`,
    template: `%s | ${STORE.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    "jual kayak",
    "jual kano",
    "perahu karet",
    "paddle board",
    "stand up paddle",
    "perahu dayung",
    "olahraga air",
    "Danau Jatiluhur",
    "Purwakarta",
    "lucksport",
  ],
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    siteName: STORE.name,
    title: `${STORE.name} — ${STORE.tagline}`,
    description: DESCRIPTION,
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    images: [{ url: "/brand/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE.name} — ${STORE.tagline}`,
    description: DESCRIPTION,
    images: ["/brand/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1559c0",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bahasa efektif ditentukan middleware (pilihan tersimpan / deteksi negara)
  // dan diteruskan lewat header — dipakai agar SSR langsung benar tanpa kedipan.
  const lang: Lang =
    (await headers()).get("x-lucksport-lang") === "en" ? "en" : DEFAULT_LANG;

  // Data terstruktur bisnis lokal — membantu situs muncul di pencarian
  // lokal/Maps untuk kueri seperti "jual kayak Purwakarta".
  const businessLd = {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    name: STORE.name,
    description: DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/brand/logo.png`,
    telephone: `+${STORE.whatsappNumber}`,
    email: STORE.email,
    sameAs: [STORE.instagramUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: STORE.city,
      addressRegion: STORE.region,
      postalCode: STORE.postalCode,
      addressCountry: STORE.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STORE.geo.lat,
      longitude: STORE.geo.lng,
    },
    openingHours: "Mo-Sa 08:00-21:00",
  };

  return (
    <html lang={lang} className={`${poppins.variable} ${fraunces.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }}
        />
        <LanguageProvider initialLang={lang}>
          <CartProvider>
            <WishlistProvider>
              <OrdersProvider>{children}</OrdersProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
