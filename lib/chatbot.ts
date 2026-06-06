// Basis pengetahuan chatbot Luck Sport — balasan instan berbasis aturan.
// Dua bahasa (ID/EN): pencocokan kata kunci lintas-bahasa, balasan sesuai bahasa.
import type { Lang } from "./i18n";

export interface BotReply {
  text: string;
  chips?: string[]; // saran balasan cepat
  wa?: boolean; // tampilkan tombol "Hubungi CS via WhatsApp"
  search?: string; // jika diisi, UI menjalankan pencarian produk
}

const L = (lang: Lang, id: string, en: string) => (lang === "en" ? en : id);

export const CHIPS: Record<Lang, string[]> = {
  id: ["Lihat produk", "Cara pesan", "Ongkir & bayar", "Jam buka", "Hubungi CS"],
  en: ["View products", "How to order", "Shipping & payment", "Hours", "Contact CS"],
};

export function greeting(lang: Lang): BotReply {
  return {
    text: L(
      lang,
      "Halo! 👋 Saya asisten virtual Luck Sport — siap membantu seketika. Ada yang bisa saya bantu?",
      "Hi! 👋 I'm the Luck Sport virtual assistant — here to help instantly. How can I help you?"
    ),
    chips: CHIPS[lang],
  };
}

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));

export function botReply(input: string, lang: Lang = "id"): BotReply {
  const t = input.toLowerCase().trim();
  const chips = CHIPS[lang];

  // Sapaan
  if (
    has(t, "halo", "hai", "hallo", "assalam", "pagi", "siang", "sore", "malam",
      "hello", "hey", "good morning", "good afternoon") &&
    t.length < 20
  ) {
    return greeting(lang);
  }

  // Terima kasih
  if (has(t, "terima kasih", "makasih", "thanks", "thx", "thank", "mantap", "oke", "ok ")) {
    return {
      text: L(lang,
        "Sama-sama! 😊 Senang bisa membantu. Ada lagi yang ingin ditanyakan?",
        "You're welcome! 😊 Happy to help. Anything else?"),
      chips,
    };
  }

  // Cara pesan
  if (has(t, "cara pesan", "cara order", "cara beli", "pesan", "order", "checkout",
    "bagaimana beli", "how to order", "how to buy", "how to purchase", "ordering")) {
    return {
      text: L(lang,
        "Cara pesan mudah:\n1️⃣ Pilih produk → klik 'Tambah ke Keranjang'\n2️⃣ Buka keranjang → 'Checkout via WhatsApp'\n3️⃣ CS konfirmasi stok, ongkir, & pembayaran\n\nUntuk produk olahraga air (perahu/kayak/kano/SUP), klik tombol 'Call CS' di halaman produknya. 🚣",
        "Ordering is easy:\n1️⃣ Pick a product → click 'Add to Cart'\n2️⃣ Open the cart → 'Checkout via WhatsApp'\n3️⃣ CS confirms stock, shipping & payment\n\nFor water-sports products (boats/kayaks/canoes/SUP), click the 'Call CS' button on the product page. 🚣"),
      chips: lang === "en"
        ? ["View products", "Shipping & payment", "Contact CS"]
        : ["Lihat produk", "Ongkir & bayar", "Hubungi CS"],
    };
  }

  // Ongkir / pengiriman (& chip "Shipping & payment")
  if (has(t, "ongkir", "ongkos", "kirim", "pengiriman", "ekspedisi", "kurir", "sampai",
    "shipping", "delivery", "ship", "courier", "postage", "& bayar", "& payment")) {
    return {
      text: L(lang,
        "📦 Kami kirim ke seluruh Indonesia. Estimasi ongkir bisa kamu cek di halaman Keranjang (pilih provinsi tujuan). Ongkir final & kurir dikonfirmasi CS saat checkout.",
        "📦 We ship across Indonesia. You can estimate shipping on the Cart page (choose your province). Final cost & courier are confirmed by CS at checkout."),
      chips: lang === "en"
        ? ["How to order", "Payment", "Contact CS"]
        : ["Cara pesan", "Pembayaran", "Hubungi CS"],
    };
  }

  // Pembayaran
  if (has(t, "bayar", "pembayaran", "transfer", "rekening", "cicil", "tempo",
    "payment", "pay", "bank")) {
    return {
      text: L(lang,
        "💳 Pembayaran saat ini via transfer bank, dikonfirmasi CS setelah checkout. Untuk pembelian besar (mis. perahu), CS bantu atur detailnya.",
        "💳 Payment is currently via bank transfer, confirmed by CS after checkout. For large purchases (e.g. boats), CS will help arrange the details."),
      chips: lang === "en" ? ["How to order", "Contact CS"] : ["Cara pesan", "Hubungi CS"],
    };
  }

  // Harga
  if (has(t, "harga", "berapa", "biaya", "price", "murah", "diskon", "promo", "cost", "how much", "discount")) {
    return {
      text: L(lang,
        "💰 Harga produk umum tertera di halaman masing-masing. Untuk produk olahraga air (perahu, kayak, kano, SUP), harga menyesuaikan spesifikasi — silakan klik 'Call CS' untuk penawaran terbaik. Cek juga halaman Promo untuk diskon!",
        "💰 Prices for general products are shown on each product page. For water-sports products (boats, kayaks, canoes, SUP), pricing depends on specs — click 'Call CS' for the best quote. Also check the Promo page for discounts!"),
      chips: lang === "en" ? ["View products", "Contact CS"] : ["Lihat produk", "Hubungi CS"],
    };
  }

  // Jam operasional
  if (has(t, "jam", "buka", "operasional", "tutup", "kapan", "hours", "open", "schedule", "when")) {
    return {
      text: L(lang,
        "🕗 Jam layanan CS: Senin–Sabtu, 08.00–21.00 WIB.\nTapi tenang — saya (asisten) siap menjawab 24 jam!",
        "🕗 CS hours: Mon–Sat, 8 AM–9 PM (WIB).\nBut don't worry — I (the assistant) am here 24/7!"),
      chips,
    };
  }

  // Ukuran / spesifikasi
  if (has(t, "ukuran", "size", "spesifikasi", "spek", "spec", "dimensi", "warna",
    "bahan", "material", "specification", "color", "dimension")) {
    return {
      text: L(lang,
        "📏 Untuk spesifikasi detail (ukuran, bahan, kapasitas) produk olahraga air, tim kami bantu lebih akurat via Call CS. Untuk apparel, panduan ukuran ada di halaman produk.",
        "📏 For detailed specs (size, material, capacity) of water-sports products, our team can help more accurately via Call CS. For apparel, a size guide is on the product page."),
      chips: lang === "en" ? ["View products", "Contact CS"] : ["Lihat produk", "Hubungi CS"],
    };
  }

  // Hubungi CS / manusia
  if (has(t, "cs", "admin", "manusia", "orang", "whatsapp", "wa ", "hubungi", "kontak",
    "telepon", "komplain", "keluhan", "human", "agent", "contact", "complaint", "talk to")) {
    return {
      text: L(lang,
        "Tentu! Kamu bisa terhubung langsung dengan CS kami via WhatsApp di bawah ini. 👇",
        "Sure! You can reach our CS directly via WhatsApp below. 👇"),
      wa: true,
    };
  }

  // Kategori / lihat produk
  if (has(t, "lihat produk", "produk", "katalog", "barang", "jual apa", "ada apa",
    "view products", "products", "catalog", "catalogue", "browse", "what do you sell")) {
    return {
      text: L(lang,
        "Kami menyediakan produk olahraga air:\n🚣 Kayak (K1/K2/K4), Kano (C1/C2), Perahu karet (LCR), papan SUP, dan lainnya.\n\nKetik nama/jenis produk yang kamu cari, atau buka katalog lengkap.",
        "We offer water-sports products:\n🚣 Kayaks (K1/K2/K4), Canoes (C1/C2), inflatable boats (LCR), SUP boards, and more.\n\nType the product you're looking for, or open the full catalog."),
      chips: lang === "en"
        ? ["Kayak", "Canoe", "Inflatable boat", "Contact CS"]
        : ["Kayak", "Kano", "Perahu karet", "Hubungi CS"],
    };
  }

  // Kata kunci produk → langsung cari
  if (has(t, "kayak", "kano", "canoe", "perahu", "sup", "paddle", "dayung", "inflatable",
    "karet", "slalom", "outrigger", "k1", "k2", "k4", "c1", "c2", "fiber", "boat")) {
    return {
      text: L(lang, `Sebentar, saya carikan "${input.trim()}"… 🔎`,
        `One moment, searching for "${input.trim()}"… 🔎`),
      search: input.trim(),
    };
  }

  // Default: coba cari produk
  if (t.length >= 3) {
    return {
      text: L(lang, `Saya coba carikan "${input.trim()}"…`,
        `Let me search for "${input.trim()}"…`),
      search: input.trim(),
    };
  }

  return {
    text: L(lang,
      "Maaf, saya belum paham 😅. Saya bisa bantu soal produk, cara pesan, ongkir, pembayaran, atau hubungkan ke CS.",
      "Sorry, I didn't quite get that 😅. I can help with products, ordering, shipping, payment, or connect you to CS."),
    chips,
    wa: true,
  };
}
