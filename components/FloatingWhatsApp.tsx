"use client";

// Strip WhatsApp CS mengambang (PRD 5.1.4) — sticky di semua halaman,
// pojok kanan bawah. Diberi posisi agar tidak menutupi tombol di mobile.
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

export default function FloatingWhatsApp() {
  return (
    <a
      href={waGeneral()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-4 z-30 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-white shadow-lg shadow-whatsapp/30 transition-transform hover:scale-105 hover:bg-whatsapp-dark sm:bottom-6 sm:right-6"
      aria-label="Chat Customer Service via WhatsApp"
    >
      <span className="relative flex">
        <WhatsAppIcon width={26} height={26} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-accent-400 ring-2 ring-white" />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">Chat CS</span>
    </a>
  );
}
