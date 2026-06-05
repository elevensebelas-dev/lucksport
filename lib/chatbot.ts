// Basis pengetahuan chatbot Luck Sport — balasan instan berbasis aturan.
// Tanpa API eksternal: cepat, gratis, dan selalu online. Untuk hal kompleks,
// chatbot mengarahkan ke CS manusia via WhatsApp.
import { STORE } from "./config";

export interface BotReply {
  text: string;
  chips?: string[]; // saran balasan cepat
  wa?: boolean; // tampilkan tombol "Hubungi CS via WhatsApp"
  search?: string; // jika diisi, UI menjalankan pencarian produk
}

export const MAIN_CHIPS = [
  "Lihat produk",
  "Cara pesan",
  "Ongkir & bayar",
  "Jam buka",
  "Hubungi CS",
];

export const GREETING: BotReply = {
  text:
    "Halo! 👋 Saya asisten virtual Luck Sport — siap membantu seketika. Ada yang bisa saya bantu?",
  chips: MAIN_CHIPS,
};

const has = (t: string, ...words: string[]) =>
  words.some((w) => t.includes(w));

export function botReply(input: string): BotReply {
  const t = input.toLowerCase().trim();

  // Sapaan
  if (
    has(t, "halo", "hai", "hi ", "hallo", "assalam", "pagi", "siang", "sore", "malam") &&
    t.length < 20
  ) {
    return GREETING;
  }

  // Terima kasih
  if (has(t, "terima kasih", "makasih", "thanks", "thx", "mantap", "oke", "ok ")) {
    return {
      text: "Sama-sama! 😊 Senang bisa membantu. Ada lagi yang ingin ditanyakan?",
      chips: MAIN_CHIPS,
    };
  }

  // Cara pesan
  if (has(t, "cara pesan", "cara order", "cara beli", "pesan", "order", "checkout", "bagaimana beli")) {
    return {
      text:
        "Cara pesan mudah:\n1️⃣ Pilih produk → klik 'Tambah ke Keranjang'\n2️⃣ Buka keranjang → 'Checkout via WhatsApp'\n3️⃣ CS konfirmasi stok, ongkir, & pembayaran\n\nUntuk produk olahraga air (perahu/kayak/kano/SUP), klik tombol 'Call CS' di halaman produknya. 🚣",
      chips: ["Lihat produk", "Ongkir & bayar", "Hubungi CS"],
    };
  }

  // Ongkir / pengiriman
  if (has(t, "ongkir", "ongkos", "kirim", "pengiriman", "ekspedisi", "kurir", "sampai")) {
    return {
      text:
        "📦 Kami kirim ke seluruh Indonesia. Estimasi ongkir bisa kamu cek sendiri di halaman Keranjang (pilih provinsi tujuan). Ongkir final & kurir dikonfirmasi CS saat checkout.",
      chips: ["Cara pesan", "Pembayaran", "Hubungi CS"],
    };
  }

  // Pembayaran
  if (has(t, "bayar", "pembayaran", "transfer", "rekening", "dp", "cicil", "tempo")) {
    return {
      text:
        "💳 Pembayaran saat ini via transfer bank, dikonfirmasi CS setelah checkout. Untuk pembelian besar (mis. perahu), CS bantu atur detailnya.",
      chips: ["Cara pesan", "Hubungi CS"],
    };
  }

  // Harga
  if (has(t, "harga", "berapa", "biaya", "price", "murah", "diskon", "promo")) {
    return {
      text:
        "💰 Harga produk umum tertera di halaman masing-masing. Untuk produk olahraga air (perahu, kayak, kano, SUP), harga menyesuaikan spesifikasi — silakan klik 'Call CS' untuk penawaran terbaik. Cek juga halaman Promo untuk diskon!",
      chips: ["Lihat produk", "Hubungi CS"],
      wa: false,
    };
  }

  // Jam operasional
  if (has(t, "jam", "buka", "operasional", "tutup", "kapan")) {
    return {
      text: `🕗 Jam layanan CS: ${STORE.operationalDays}, ${STORE.operationalHours}.\nTapi tenang — saya (asisten) siap menjawab 24 jam!`,
      chips: MAIN_CHIPS,
    };
  }

  // Ukuran / spesifikasi
  if (has(t, "ukuran", "size", "spesifikasi", "spek", "spec", "dimensi", "warna", "bahan", "material")) {
    return {
      text:
        "📏 Untuk spesifikasi detail (ukuran, bahan, kapasitas) produk olahraga air, tim kami bantu lebih akurat via Call CS. Untuk apparel (jersey/celana/sepatu), panduan ukuran ada di halaman produk.",
      chips: ["Lihat produk", "Hubungi CS"],
    };
  }

  // Hubungi CS / manusia
  if (has(t, "cs", "admin", "manusia", "orang", "whatsapp", "wa ", "hubungi", "kontak", "telepon", "komplain", "keluhan")) {
    return {
      text:
        "Tentu! Kamu bisa terhubung langsung dengan CS kami via WhatsApp di bawah ini. 👇",
      wa: true,
    };
  }

  // Kategori / lihat produk
  if (has(t, "lihat produk", "produk", "katalog", "barang", "jual apa", "ada apa")) {
    return {
      text:
        "Kami menyediakan:\n🚣 Perahu — kayak, kano, perahu karet (LCR), papan SUP\n👕 Jersey · 👟 Sepatu · 🩳 Celana · 🎒 Aksesori\n\nKetik nama/jenis produk yang kamu cari, atau buka katalog lengkap.",
      chips: ["Kayak", "Perahu karet", "SUP", "Hubungi CS"],
    };
  }

  // Kata kunci produk olahraga air → langsung cari
  if (has(t, "kayak", "kano", "canoe", "perahu", "sup", "paddle", "dayung", "inflatable", "karet", "slalom", "outrigger", "k1", "k2", "k4", "c1", "c2", "fiber")) {
    return {
      text: `Sebentar, saya carikan produk untuk "${input.trim()}"… 🔎`,
      search: input.trim(),
    };
  }

  // Apparel keywords → cari
  if (has(t, "jersey", "sepatu", "celana", "topi", "tas", "kaos", "aksesori")) {
    return {
      text: `Sebentar, saya carikan "${input.trim()}"… 🔎`,
      search: input.trim(),
    };
  }

  // Default: coba cari produk; kalau tak ketemu, eskalasi ke CS
  if (t.length >= 3) {
    return {
      text: `Saya coba carikan "${input.trim()}"…`,
      search: input.trim(),
    };
  }

  return {
    text:
      "Maaf, saya belum paham 😅. Saya bisa bantu soal produk, cara pesan, ongkir, pembayaran, atau hubungkan ke CS.",
    chips: MAIN_CHIPS,
    wa: true,
  };
}
