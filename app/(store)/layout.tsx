import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";
import ChatBot from "@/components/ChatBot";

// Layout storefront: header, footer, mini-cart, dan chatbot mengambang.
// Halaman /admin berada di luar grup ini sehingga tidak memuat chrome toko.
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MiniCart />
      <ChatBot />
    </div>
  );
}
