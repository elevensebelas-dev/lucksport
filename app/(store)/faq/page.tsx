import type { Metadata } from "next";
import Link from "next/link";
import { STORE } from "@/lib/config";
import { WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan Umum",
  description:
    "Cara pemesanan, metode pembayaran, pengiriman, penukaran, dan panduan ukuran di Lucksport.",
};

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Cara Pemesanan",
    items: [
      {
        q: "Bagaimana cara memesan di Lucksport?",
        a: "1) Pilih produk dari katalog. 2) Pilih ukuran & warna, lalu klik 'Tambah ke Keranjang'. 3) Buka keranjang dan klik 'Checkout via WhatsApp'. 4) Ringkasan pesananmu otomatis terkirim ke CS kami. 5) CS akan konfirmasi stok, ongkir, dan instruksi pembayaran.",
      },
      {
        q: "Apakah saya harus punya akun untuk memesan?",
        a: "Tidak perlu. Kamu bisa langsung belanja dan checkout via WhatsApp tanpa registrasi.",
      },
      {
        q: "Bisakah memesan dalam jumlah banyak untuk tim?",
        a: "Tentu! Untuk order grosir/seragam tim, langsung chat CS kami via WhatsApp agar bisa kami bantu dengan harga dan ketersediaan ukuran.",
      },
    ],
  },
  {
    title: "Pembayaran",
    items: [
      {
        q: "Metode pembayaran apa yang diterima?",
        a: "Saat ini pembayaran dilakukan melalui transfer bank manual. Setelah checkout via WhatsApp, CS akan memberikan nomor rekening dan total yang harus dibayar.",
      },
      {
        q: "Apakah ada pembayaran otomatis (payment gateway)?",
        a: "Belum. Untuk saat ini seluruh pembayaran diproses manual via transfer bank setelah konfirmasi CS.",
      },
    ],
  },
  {
    title: "Pengiriman",
    items: [
      {
        q: "Ke mana saja Lucksport mengirim?",
        a: "Kami mengirim ke seluruh Indonesia menggunakan jasa kurir pilihanmu.",
      },
      {
        q: "Berapa estimasi waktu pengiriman?",
        a: "Estimasi umumnya 2–5 hari kerja tergantung lokasi dan kurir. CS akan memberikan estimasi yang lebih akurat saat konfirmasi pesanan.",
      },
      {
        q: "Bagaimana cara menghitung ongkos kirim?",
        a: "Ongkir dihitung berdasarkan alamat tujuan dan kurir pilihanmu, lalu diinformasikan oleh CS saat proses konfirmasi via WhatsApp.",
      },
    ],
  },
  {
    title: "Penukaran & Pengembalian",
    items: [
      {
        q: "Apakah bisa tukar ukuran?",
        a: "Penukaran ukuran dapat dilakukan dalam 3 hari setelah barang diterima, selama produk belum dipakai, label utuh, dan menyertakan bukti pembelian. Ongkir penukaran ditanggung pembeli.",
      },
      {
        q: "Bagaimana jika produk yang diterima cacat?",
        a: "Segera hubungi CS dengan menyertakan foto produk dalam 2x24 jam setelah barang diterima. Kami akan bantu proses penggantian.",
      },
    ],
  },
  {
    title: "Panduan Ukuran",
    items: [
      {
        q: "Bagaimana cara menentukan ukuran yang tepat?",
        a: "Setiap halaman produk memiliki tombol 'Panduan Ukuran' dengan tabel detail. Ukur lingkar dada untuk pakaian, atau panjang telapak kaki untuk sepatu, lalu cocokkan dengan tabel.",
      },
      {
        q: "Ragu memilih ukuran, harus bagaimana?",
        a: "Jangan ragu chat CS kami via WhatsApp. Sebutkan tinggi, berat, atau ukuran biasamu, dan kami bantu rekomendasikan.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Pertanyaan Umum
          </h1>
          <p className="mt-3 text-slate-600">
            Semua yang perlu kamu tahu sebelum belanja di Lucksport.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {FAQ_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-lg font-bold text-brand-700">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl border border-slate-200 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900">
                      {item.q}
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Masih ada pertanyaan?
          </h2>
          <p className="mt-2 text-slate-600">
            Tim CS kami siap membantu di {STORE.operationalDays},{" "}
            {STORE.operationalHours}.
          </p>
          <a
            href={`https://wa.me/${STORE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-5"
          >
            <WhatsAppIcon width={20} height={20} /> Chat CS via WhatsApp
          </a>
          <p className="mt-4 text-sm text-slate-500">
            Atau jelajahi{" "}
            <Link href="/katalog" className="font-medium text-brand-600 hover:underline">
              katalog produk
            </Link>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
}
