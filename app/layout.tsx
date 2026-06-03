import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrdersProvider } from "@/context/OrdersContext";
import Analytics from "@/components/Analytics";
import { STORE } from "@/lib/config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
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
  openGraph: {
    title: `${STORE.name} — ${STORE.tagline}`,
    description:
      "Temukan gear olahraga terbaik. Jersey, sepatu, celana & aksesori. Checkout cepat via WhatsApp.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#1559c0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={poppins.variable}>
      <body>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>{children}</OrdersProvider>
          </WishlistProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
