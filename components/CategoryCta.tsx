"use client";

import { useLang } from "@/context/LanguageContext";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";

/**
 * Ajakan konsultasi di akhir halaman kategori.
 *
 * Pesan WhatsApp sudah menyebut kategorinya, sehingga CS langsung tahu
 * konteks pertanyaan tanpa pelanggan perlu mengetik ulang.
 */
export default function CategoryCta({ category }: { category: string }) {
  const { lang } = useLang();

  const message =
    lang === "en"
      ? `Hello Luck Sport, I would like to ask about your ${category} products.`
      : `Halo Luck Sport, saya ingin bertanya tentang produk ${category}.`;

  return (
    <section className="mt-14 rounded-2xl bg-slate-900 p-8 text-center sm:p-10">
      <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
        {lang === "en"
          ? "Want pricing and availability?"
          : "Ingin tahu harga dan ketersediaan?"}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
        {lang === "en"
          ? "Every boat is built to order, so pricing follows the spec. Chat with us for a quote."
          : "Setiap perahu dibuat sesuai kebutuhan, jadi harganya menyesuaikan spesifikasi. Chat kami untuk penawaran."}
      </p>
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-bold text-[#052e16] transition-transform hover:scale-[1.03]"
      >
        <WhatsAppIcon width={20} height={20} />
        {lang === "en" ? "Ask via WhatsApp" : "Tanya via WhatsApp"}
      </a>
    </section>
  );
}
