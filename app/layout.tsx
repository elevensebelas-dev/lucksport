import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Analytics from "@/components/Analytics";
import { STORE } from "@/lib/config";
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

export const metadata: Metadata = {
  metadataBase: new URL(`https://${STORE.domain}`),
  title: {
    default: `${STORE.name} — ${STORE.tagline}`,
    template: `%s | ${STORE.name}`,
  },
  description:
    "Lucksport — toko perlengkapan olahraga: jersey, sepatu, celana, dan aksesori berkualitas. Belanja mudah, checkout cepat via WhatsApp.",
  keywords: [
    "perlengkapan olahraga",
    "jersey",
    "sepatu olahraga",
    "lucksport",
    "toko olahraga online",
  ],
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
  openGraph: {
    title: `${STORE.name} — ${STORE.tagline}`,
    description:
      "Temukan gear olahraga terbaik. Jersey, sepatu, celana & aksesori. Checkout cepat via WhatsApp.",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/brand/logo.png" }],
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

  return (
    <html lang={lang} className={`${poppins.variable} ${fraunces.variable}`}>
      <body>
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
