import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/lib/config";
import { WhatsAppIcon, StarIcon, ShieldIcon, TruckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali Lucksport — toko perlengkapan olahraga untuk atlet amatir, komunitas, dan keluarga Indonesia.",
};

const VALUES = [
  {
    icon: StarIcon,
    title: "Kualitas Terbaik",
    desc: "Produk pilihan yang teruji untuk menunjang performa olahragamu.",
  },
  {
    icon: ShieldIcon,
    title: "Jujur & Terpercaya",
    desc: "Foto produk nyata dan indikator stok yang selalu kami jaga akurat.",
  },
  {
    icon: TruckIcon,
    title: "Pengiriman Andal",
    desc: "Kami kirim ke seluruh Indonesia dengan kurir pilihanmu.",
  },
];

export default function TentangKamiPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-700">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=75&auto=format&fit=crop"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="container-content relative py-20 text-center text-white">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Tentang Lucksport</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Perlengkapan olahraga berkualitas untuk setiap orang yang mencintai
            gerak dan kompetisi.
          </p>
        </div>
      </section>

      {/* Cerita brand */}
      <section className="container-content grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&q=75&auto=format&fit=crop"
            alt="Komunitas olahraga Lucksport"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Cerita Kami</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Lucksport lahir dari kecintaan terhadap olahraga dan komunitas. Berawal
            dari memasarkan produk lewat Instagram{" "}
            <a
              href={STORE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              @{STORE.instagram}
            </a>
            , kami tumbuh bersama para atlet amatir, manajer tim komunitas, dan
            keluarga yang ingin tetap aktif.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Kini kami hadir lebih dekat lewat website resmi — agar kamu bisa melihat
            katalog lengkap, foto produk yang jelas, dan memesan dengan mudah lewat
            WhatsApp. Tanpa ribet, langsung ke produknya.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-brand-700">Misi</h3>
              <p className="mt-1 text-sm text-slate-600">
                Menyediakan perlengkapan olahraga berkualitas dengan harga
                terjangkau dan pelayanan yang ramah.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-brand-700">Visi</h3>
              <p className="mt-1 text-sm text-slate-600">
                Menjadi toko perlengkapan olahraga online tepercaya bagi komunitas
                olahraga Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="bg-slate-50 py-16">
        <div className="container-content">
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Kenapa Lucksport?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <v.icon width={26} height={26} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="container-content py-16">
        <div className="rounded-2xl bg-brand-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Hubungi Kami</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Ada pertanyaan tentang produk, ukuran, atau order grosir untuk tim?
            Tim CS kami siap membantu di jam operasional {STORE.operationalDays},{" "}
            {STORE.operationalHours}.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${STORE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-7 py-3.5 text-base"
            >
              <WhatsAppIcon width={20} height={20} /> Chat WhatsApp
            </a>
            <Link href="/katalog" className="btn-accent px-7 py-3.5 text-base">
              Lihat Katalog
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-200">
            Email: {STORE.email} · Instagram: @{STORE.instagram} · {STORE.address}
          </p>
        </div>
      </section>
    </div>
  );
}
