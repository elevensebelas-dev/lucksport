import type { Metadata } from "next";
import { STORE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Syarat & Kebijakan",
  description:
    "Syarat & ketentuan pembelian serta kebijakan privasi Lucksport.",
};

export default function KebijakanPage() {
  return (
    <div className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Syarat & Kebijakan
        </h1>
        <p className="mt-3 text-slate-600">
          Terakhir diperbarui: Mei 2025
        </p>

        {/* S&K */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Syarat & Ketentuan Pembelian
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
            <p>
              Dengan melakukan pemesanan di {STORE.name}, kamu dianggap menyetujui
              seluruh syarat dan ketentuan berikut.
            </p>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <strong className="text-slate-800">Pemesanan.</strong> Pesanan
                dianggap sah setelah dikonfirmasi oleh Customer Service melalui
                WhatsApp, termasuk ketersediaan stok dan total pembayaran.
              </li>
              <li>
                <strong className="text-slate-800">Harga.</strong> Seluruh harga
                tertera dalam Rupiah (IDR) dan belum termasuk ongkos kirim. Harga
                dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.
              </li>
              <li>
                <strong className="text-slate-800">Pembayaran.</strong> Pembayaran
                dilakukan via transfer bank sesuai instruksi CS. Pesanan diproses
                setelah pembayaran terverifikasi.
              </li>
              <li>
                <strong className="text-slate-800">Ketersediaan Stok.</strong> Stok
                yang tertera di website diperbarui secara berkala. CS akan
                mengonfirmasi ketersediaan akhir saat pemesanan.
              </li>
              <li>
                <strong className="text-slate-800">Pengiriman.</strong> Risiko
                keterlambatan oleh pihak kurir di luar tanggung jawab {STORE.name},
                namun kami akan membantu pelacakan.
              </li>
              <li>
                <strong className="text-slate-800">Penukaran.</strong> Penukaran
                mengikuti ketentuan yang tercantum pada halaman FAQ.
              </li>
            </ol>
          </div>
        </section>

        {/* Privasi */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Kebijakan Privasi</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
            <p>
              Kami menghargai privasimu. Berikut bagaimana kami menangani data yang
              kamu berikan.
            </p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <strong className="text-slate-800">Data yang dikumpulkan.</strong>{" "}
                Kami hanya menerima data yang kamu kirimkan secara sukarela melalui
                WhatsApp (nama, alamat pengiriman, kontak) untuk memproses pesanan.
              </li>
              <li>
                <strong className="text-slate-800">Penggunaan data.</strong> Data
                digunakan semata-mata untuk pemrosesan pesanan, pengiriman, dan
                komunikasi layanan pelanggan.
              </li>
              <li>
                <strong className="text-slate-800">Keamanan.</strong> Website ini
                menggunakan koneksi aman (HTTPS). Kami tidak menyimpan data
                pembayaran apa pun di website.
              </li>
              <li>
                <strong className="text-slate-800">Pihak ketiga.</strong> Kami tidak
                menjual atau membagikan datamu kepada pihak ketiga selain untuk
                keperluan pengiriman (jasa kurir).
              </li>
              <li>
                <strong className="text-slate-800">Keranjang belanja.</strong>{" "}
                Keranjang disimpan secara lokal di perangkatmu (local storage) dan
                tidak dikirim ke server kami sampai kamu checkout via WhatsApp.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">Pertanyaan?</h2>
          <p className="mt-2 text-slate-600">
            Untuk pertanyaan terkait kebijakan ini, hubungi kami di{" "}
            <span className="font-medium text-brand-700">{STORE.email}</span> atau
            via WhatsApp CS.
          </p>
        </section>
      </div>
    </div>
  );
}
