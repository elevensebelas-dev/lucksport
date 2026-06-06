"use client";

import { useLang } from "@/context/LanguageContext";
import { STORE } from "@/lib/config";

type Bi = { id: string; en: string };

const TERMS: { label: Bi; text: Bi }[] = [
  {
    label: { id: "Pemesanan", en: "Orders" },
    text: {
      id: "Pesanan dianggap sah setelah dikonfirmasi oleh Customer Service melalui WhatsApp, termasuk ketersediaan/spesifikasi dan total pembayaran.",
      en: "An order is valid once confirmed by Customer Service via WhatsApp, including availability/specs and the total payment.",
    },
  },
  {
    label: { id: "Harga", en: "Pricing" },
    text: {
      id: "Harga dalam Rupiah (IDR) dan belum termasuk ongkos kirim. Produk olahraga air menggunakan skema 'Call CS' karena harga menyesuaikan spesifikasi. Harga dapat berubah sewaktu-waktu.",
      en: "Prices are in Rupiah (IDR) and exclude shipping. Water-sports products use a 'Call CS' scheme as pricing depends on specs. Prices may change at any time.",
    },
  },
  {
    label: { id: "Pembayaran", en: "Payment" },
    text: {
      id: "Pembayaran via transfer bank sesuai instruksi CS. Pesanan diproses setelah pembayaran terverifikasi.",
      en: "Payment is via bank transfer per CS instructions. Orders are processed after payment is verified.",
    },
  },
  {
    label: { id: "Ketersediaan", en: "Availability" },
    text: {
      id: "Ketersediaan akhir dikonfirmasi CS saat pemesanan. Untuk produk kustom/perahu, lead time produksi diinformasikan CS.",
      en: "Final availability is confirmed by CS at order time. For custom/boat products, production lead time is communicated by CS.",
    },
  },
  {
    label: { id: "Pengiriman", en: "Shipping" },
    text: {
      id: `Risiko keterlambatan oleh kurir di luar tanggung jawab ${STORE.name}, namun kami membantu pelacakan. Untuk barang besar, metode pengiriman dikoordinasikan terlebih dahulu.`,
      en: `Courier delays are beyond ${STORE.name}'s control, but we assist with tracking. For large items, the shipping method is coordinated in advance.`,
    },
  },
  {
    label: { id: "Garansi & Penukaran", en: "Warranty & Returns" },
    text: {
      id: "Mengikuti ketentuan pada halaman FAQ. Cacat produksi dilaporkan dengan foto dalam 2x24 jam setelah barang diterima.",
      en: "Follows the terms on the FAQ page. Manufacturing defects must be reported with photos within 48 hours of receipt.",
    },
  },
];

const PRIVACY: { label: Bi; text: Bi }[] = [
  {
    label: { id: "Data yang dikumpulkan", en: "Data collected" },
    text: {
      id: "Kami hanya menerima data yang kamu kirimkan sukarela via WhatsApp (nama, alamat pengiriman, kontak) untuk memproses pesanan.",
      en: "We only receive data you voluntarily provide via WhatsApp (name, shipping address, contact) to process your order.",
    },
  },
  {
    label: { id: "Penggunaan data", en: "Use of data" },
    text: {
      id: "Data dipakai semata untuk pemrosesan pesanan, pengiriman, dan komunikasi layanan pelanggan.",
      en: "Data is used solely for order processing, shipping, and customer-service communication.",
    },
  },
  {
    label: { id: "Keamanan", en: "Security" },
    text: {
      id: "Website memakai koneksi aman (HTTPS). Kami tidak menyimpan data pembayaran apa pun di website.",
      en: "The website uses a secure connection (HTTPS). We do not store any payment data on the website.",
    },
  },
  {
    label: { id: "Pihak ketiga", en: "Third parties" },
    text: {
      id: "Kami tidak menjual atau membagikan datamu kecuali untuk keperluan pengiriman (jasa kurir).",
      en: "We do not sell or share your data except as needed for shipping (couriers).",
    },
  },
  {
    label: { id: "Keranjang belanja", en: "Shopping cart" },
    text: {
      id: "Keranjang & riwayat pesanan disimpan lokal di perangkatmu (local storage), tidak dikirim ke server kami hingga kamu checkout via WhatsApp.",
      en: "Your cart & order history are stored locally on your device (local storage) and not sent to our servers until you check out via WhatsApp.",
    },
  },
];

export default function KebijakanClient() {
  const { lang } = useLang();
  const en = lang === "en";

  return (
    <div className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900">
          {en ? "Terms & Policies" : "Syarat & Kebijakan"}
        </h1>
        <p className="mt-3 text-slate-600">
          {en ? "Last updated: May 2025" : "Terakhir diperbarui: Mei 2025"}
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {en ? "Terms & Conditions of Purchase" : "Syarat & Ketentuan Pembelian"}
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
            <p>
              {en
                ? `By placing an order at ${STORE.name}, you agree to all the terms below.`
                : `Dengan melakukan pemesanan di ${STORE.name}, kamu dianggap menyetujui seluruh syarat dan ketentuan berikut.`}
            </p>
            <ol className="list-decimal space-y-3 pl-5">
              {TERMS.map((t) => (
                <li key={t.label.en}>
                  <strong className="text-slate-800">{t.label[lang]}.</strong>{" "}
                  {t.text[lang]}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            {en ? "Privacy Policy" : "Kebijakan Privasi"}
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
            <p>
              {en
                ? "We respect your privacy. Here's how we handle the data you provide."
                : "Kami menghargai privasimu. Berikut bagaimana kami menangani data yang kamu berikan."}
            </p>
            <ul className="list-disc space-y-3 pl-5">
              {PRIVACY.map((p) => (
                <li key={p.label.en}>
                  <strong className="text-slate-800">{p.label[lang]}.</strong>{" "}
                  {p.text[lang]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            {en ? "Questions?" : "Pertanyaan?"}
          </h2>
          <p className="mt-2 text-slate-600">
            {en ? "For questions about these policies, contact us at " : "Untuk pertanyaan terkait kebijakan ini, hubungi kami di "}
            <span className="font-medium text-brand-700">{STORE.email}</span>
            {en ? " or via WhatsApp CS." : " atau via WhatsApp CS."}
          </p>
        </section>
      </div>
    </div>
  );
}
