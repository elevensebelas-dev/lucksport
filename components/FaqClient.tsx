"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { STORE } from "@/lib/config";
import { WhatsAppIcon } from "./Icons";

interface QA {
  q: { id: string; en: string };
  a: { id: string; en: string };
}
interface Group {
  title: { id: string; en: string };
  items: QA[];
}

const GROUPS: Group[] = [
  {
    title: { id: "Cara Pemesanan", en: "Ordering" },
    items: [
      {
        q: { id: "Bagaimana cara memesan?", en: "How do I place an order?" },
        a: {
          id: "1) Pilih produk dari katalog. 2) Untuk apparel, pilih ukuran lalu 'Tambah ke Keranjang' → 'Checkout via WhatsApp'. 3) Untuk perahu/kayak/kano/SUP, klik 'Call CS' di halaman produk. 4) CS konfirmasi spesifikasi, stok, ongkir & pembayaran.",
          en: "1) Pick a product from the catalog. 2) For apparel, choose a size then 'Add to Cart' → 'Checkout via WhatsApp'. 3) For boats/kayaks/canoes/SUP, click 'Call CS' on the product page. 4) CS confirms specs, stock, shipping & payment.",
        },
      },
      {
        q: { id: "Apakah harus punya akun?", en: "Do I need an account?" },
        a: {
          id: "Tidak perlu. Kamu bisa langsung memesan dan checkout via WhatsApp tanpa registrasi.",
          en: "No. You can order and check out via WhatsApp without registering.",
        },
      },
      {
        q: { id: "Bisa pesan untuk tim/klub dalam jumlah banyak?", en: "Can I order in bulk for a team/club?" },
        a: {
          id: "Tentu! Untuk pembelian tim/klub atau instansi, chat CS kami via WhatsApp untuk harga dan ketersediaan.",
          en: "Absolutely! For team/club or institutional purchases, chat our CS via WhatsApp for pricing and availability.",
        },
      },
    ],
  },
  {
    title: { id: "Harga & Pembayaran", en: "Pricing & Payment" },
    items: [
      {
        q: { id: "Kenapa harga perahu tidak ditampilkan?", en: "Why isn't the boat price shown?" },
        a: {
          id: "Harga produk olahraga air menyesuaikan spesifikasi (bahan, ukuran, konfigurasi). Klik 'Call CS' agar kami beri penawaran paling akurat.",
          en: "Water-sports product pricing depends on specs (material, size, configuration). Click 'Call CS' so we can give you the most accurate quote.",
        },
      },
      {
        q: { id: "Metode pembayaran apa yang diterima?", en: "What payment methods are accepted?" },
        a: {
          id: "Saat ini via transfer bank. Setelah konfirmasi via WhatsApp, CS memberi nomor rekening dan total yang harus dibayar.",
          en: "Currently via bank transfer. After confirmation on WhatsApp, CS provides the account number and total due.",
        },
      },
    ],
  },
  {
    title: { id: "Pengiriman", en: "Shipping" },
    items: [
      {
        q: { id: "Ke mana saja Luck Sport mengirim?", en: "Where does Luck Sport ship?" },
        a: {
          id: "Ke seluruh Indonesia. Untuk perahu berukuran besar, kami atur pengiriman/kargo khusus — dikoordinasikan oleh CS.",
          en: "Across Indonesia. For large boats, we arrange special freight/cargo — coordinated by CS.",
        },
      },
      {
        q: { id: "Bagaimana menghitung ongkos kirim?", en: "How is shipping calculated?" },
        a: {
          id: "Estimasi ongkir untuk produk kecil bisa dicek di halaman Keranjang (pilih provinsi). Ongkir final & metode untuk barang besar dikonfirmasi CS.",
          en: "Shipping estimates for small items are available on the Cart page (choose a province). Final cost & method for large items are confirmed by CS.",
        },
      },
    ],
  },
  {
    title: { id: "Garansi & Penukaran", en: "Warranty & Returns" },
    items: [
      {
        q: { id: "Apakah ada garansi produk?", en: "Is there a product warranty?" },
        a: {
          id: "Produk Luck Sport melewati kontrol kualitas. Jika ada cacat produksi, hubungi CS dengan foto dalam 2x24 jam setelah barang diterima.",
          en: "Luck Sport products pass quality control. For manufacturing defects, contact CS with photos within 48 hours of receiving the item.",
        },
      },
      {
        q: { id: "Bisakah menukar produk?", en: "Can I exchange a product?" },
        a: {
          id: "Penukaran untuk apparel dapat dilakukan dalam 3 hari (produk belum dipakai, label utuh, ada bukti beli). Untuk perahu/kustom, ketentuan dibahas dengan CS.",
          en: "Apparel exchanges are possible within 3 days (unused, tags intact, proof of purchase). For boats/custom items, terms are discussed with CS.",
        },
      },
    ],
  },
  {
    title: { id: "Produk & Spesifikasi", en: "Products & Specs" },
    items: [
      {
        q: { id: "Bagaimana memilih kayak/kano yang tepat?", en: "How do I choose the right kayak/canoe?" },
        a: {
          id: "Tergantung tujuan (rekreasi, latihan, kompetisi), jumlah pendayung (K1/K2/K4, C1/C2), dan bahan (fiberglass/carbon). Chat CS, kami bantu rekomendasikan.",
          en: "It depends on your purpose (recreation, training, competition), number of paddlers (K1/K2/K4, C1/C2), and material (fiberglass/carbon). Chat CS and we'll recommend.",
        },
      },
      {
        q: { id: "Apakah tersedia suku cadang/aksesori?", en: "Are spare parts/accessories available?" },
        a: {
          id: "Untuk dayung, aksesori, dan suku cadang, tanyakan ketersediaan langsung ke CS via WhatsApp.",
          en: "For paddles, accessories, and spare parts, ask CS directly via WhatsApp for availability.",
        },
      },
    ],
  },
];

export default function FaqClient() {
  const { lang, t } = useLang();
  return (
    <div className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            {lang === "en" ? "Frequently Asked Questions" : "Pertanyaan Umum"}
          </h1>
          <p className="mt-3 text-slate-600">
            {lang === "en"
              ? "Everything you need to know before shopping at Luck Sport."
              : "Semua yang perlu kamu tahu sebelum belanja di Luck Sport."}
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {GROUPS.map((group) => (
            <div key={group.title.en}>
              <h2 className="mb-3 text-lg font-bold text-brand-700">
                {group.title[lang]}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.q.en}
                    className="group rounded-xl border border-slate-200 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900">
                      {item.q[lang]}
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-slate-600">{item.a[lang]}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            {lang === "en" ? "Still have questions?" : "Masih ada pertanyaan?"}
          </h2>
          <p className="mt-2 text-slate-600">
            {lang === "en"
              ? `Our CS team is ready to help, ${STORE.operationalDays}, ${STORE.operationalHours}.`
              : `Tim CS kami siap membantu di ${STORE.operationalDays}, ${STORE.operationalHours}.`}
          </p>
          <a
            href={`https://wa.me/${STORE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-5"
          >
            <WhatsAppIcon width={20} height={20} /> {t("footer.chatCs")}
          </a>
          <p className="mt-4 text-sm text-slate-500">
            {lang === "en" ? "Or browse our " : "Atau jelajahi "}
            <Link href="/katalog" className="font-medium text-brand-600 hover:underline">
              {lang === "en" ? "product catalog" : "katalog produk"}
            </Link>
            {lang === "en" ? "." : "."}
          </p>
        </div>
      </div>
    </div>
  );
}
