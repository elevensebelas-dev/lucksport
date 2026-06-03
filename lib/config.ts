// Konfigurasi toko Lucksport — sumber tunggal untuk info brand & WhatsApp.
// Nomor WA CS akan disediakan tim Lucksport (lihat PRD 11.1 Asumsi).

export const STORE = {
  name: "Lucksport",
  tagline: "Toko Perlengkapan Olahraga",
  // Format internasional tanpa '+' atau spasi untuk link wa.me
  whatsappNumber: "6281234567890",
  instagram: "lucksport_",
  instagramUrl: "https://instagram.com/lucksport_",
  email: "halo@lucksport.id",
  domain: "lucksport.id",
  operationalDays: "Senin – Sabtu",
  operationalHours: "08.00 – 21.00 WIB",
  address: "Purwakarta, Indonesia",
} as const;

// Pesan template sesuai PRD 5.5
export const WA_TEMPLATES = {
  general: "Halo Lucksport, saya ingin bertanya tentang produk...",
} as const;
