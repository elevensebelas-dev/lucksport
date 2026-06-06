"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { STORE } from "@/lib/config";
import { WhatsAppIcon, StarIcon, ShieldIcon, TruckIcon } from "./Icons";

export default function AboutClient() {
  const { lang } = useLang();
  const en = lang === "en";

  const values = [
    {
      icon: StarIcon,
      title: en ? "Top Quality" : "Kualitas Terbaik",
      desc: en
        ? "Race-proven kayaks, canoes & boats built for performance."
        : "Kayak, kano & perahu teruji untuk menunjang performa.",
    },
    {
      icon: ShieldIcon,
      title: en ? "Honest & Trusted" : "Jujur & Terpercaya",
      desc: en
        ? "Real product photos and honest, accurate information."
        : "Foto produk nyata dan informasi yang jujur & akurat.",
    },
    {
      icon: TruckIcon,
      title: en ? "Reliable Delivery" : "Pengiriman Andal",
      desc: en
        ? "We ship across Indonesia, including special freight for boats."
        : "Kami kirim ke seluruh Indonesia, termasuk kargo khusus perahu.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-700">
        <div className="absolute inset-0 opacity-25">
          <Image src="/gambar-ls/ls-22.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="container-content relative py-20 text-center text-white">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            {en ? "About Luck Sport" : "Tentang Luck Sport"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            {en
              ? "Quality water-sports equipment for athletes, communities, and adventurers across Indonesia."
              : "Perlengkapan olahraga air berkualitas untuk atlet, komunitas, dan pecinta petualangan di seluruh Indonesia."}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container-content grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src="/gambar-ls/ls-16.jpg"
            alt={en ? "Luck Sport water sports" : "Olahraga air Luck Sport"}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {en ? "Our Story" : "Cerita Kami"}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {en ? (
              <>
                Luck Sport Indonesia was born from a love of water and competition.
                We craft kayaks, canoes, inflatable boats, and SUP boards for
                recreation, training, and racing — supporting paddlers from beginners
                to national athletes.
              </>
            ) : (
              <>
                Luck Sport Indonesia lahir dari kecintaan pada air dan kompetisi. Kami
                memproduksi kayak, kano, perahu karet, dan papan SUP untuk rekreasi,
                latihan, hingga balapan — mendukung pendayung dari pemula sampai atlet
                nasional.
              </>
            )}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            {en ? (
              <>
                Connect with us on Instagram{" "}
                <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:text-brand-700">
                  @{STORE.instagram}
                </a>{" "}
                or order easily through this site and WhatsApp — simple, direct to the product.
              </>
            ) : (
              <>
                Terhubung dengan kami di Instagram{" "}
                <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:text-brand-700">
                  @{STORE.instagram}
                </a>{" "}
                atau pesan dengan mudah lewat website ini dan WhatsApp — simpel, langsung ke produknya.
              </>
            )}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-brand-700">{en ? "Mission" : "Misi"}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {en
                  ? "Provide quality, reliable water-sports equipment with friendly service."
                  : "Menyediakan perlengkapan olahraga air berkualitas dan andal dengan pelayanan ramah."}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-brand-700">{en ? "Vision" : "Visi"}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {en
                  ? "To be Indonesia's trusted water-sports equipment brand."
                  : "Menjadi brand perlengkapan olahraga air tepercaya di Indonesia."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="container-content">
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            {en ? "Why Luck Sport?" : "Kenapa Luck Sport?"}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
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

      {/* Contact */}
      <section className="container-content py-16">
        <div className="rounded-2xl bg-brand-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            {en ? "Get in Touch" : "Hubungi Kami"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            {en
              ? `Questions about products, specs, or bulk orders? Our CS team is ready, ${STORE.operationalDays}, ${STORE.operationalHours}.`
              : `Ada pertanyaan tentang produk, spesifikasi, atau order grosir? Tim CS kami siap di ${STORE.operationalDays}, ${STORE.operationalHours}.`}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`https://wa.me/${STORE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-7 py-3.5 text-base">
              <WhatsAppIcon width={20} height={20} /> {en ? "Chat WhatsApp" : "Chat WhatsApp"}
            </a>
            <Link href="/katalog" className="btn-accent px-7 py-3.5 text-base">
              {en ? "View Catalog" : "Lihat Katalog"}
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
