// Konfigurasi toko Lucksport — sumber tunggal untuk info brand & WhatsApp.

// Domain kanonik: dipakai metadataBase, sitemap, robots, dan JSON-LD.
// Saat domain sendiri (mis. lucksport.id) sudah aktif, cukup set
// NEXT_PUBLIC_SITE_DOMAIN di Vercel — tak perlu ubah kode.
export const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_DOMAIN || "lucksport.vercel.app";
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const STORE = {
  name: "Lucksport",
  tagline: "Perahu & Perlengkapan Olahraga Air",
  // Format internasional tanpa '+' atau spasi untuk link wa.me
  whatsappNumber: "6289650639650",
  instagram: "lucksport_",
  instagramUrl: "https://instagram.com/lucksport_",
  email: "halo@lucksport.id",
  domain: SITE_DOMAIN,
  operationalDays: "Senin – Sabtu",
  operationalHours: "08.00 – 21.00 WIB",
  address: "Purwakarta, Indonesia",
  // Danau Jatiluhur — dipakai JSON-LD LocalBusiness (local SEO).
  geo: { lat: -6.5344, lng: 107.3861 },
  city: "Purwakarta",
  region: "Jawa Barat",
  postalCode: "41152",
  country: "ID",
} as const;

// Pesan template sesuai PRD 5.5
export const WA_TEMPLATES = {
  general: "Halo Lucksport, saya ingin bertanya tentang perahu...",
} as const;
