// Sistem dua bahasa (Indonesia / English) — kamus terpusat.
// Pemakaian: t("nav.catalog") di komponen, atau <T k="nav.catalog" />.

export type Lang = "id" | "en";

export const LANGS: Lang[] = ["id", "en"];
export const DEFAULT_LANG: Lang = "id";

type Dict = Record<string, string>;

const id: Dict = {
  // Umum
  "common.shopNow": "Belanja Sekarang",
  "common.viewCatalog": "Lihat Katalog",
  "common.viewAll": "Lihat Semua",
  "common.viewDetail": "Lihat Detail",
  "common.addToCart": "Tambah ke Keranjang",
  "common.callCS": "Call CS",
  "common.priceOnRequest": "Hubungi CS untuk harga",
  "common.outOfStock": "Stok Habis",
  "common.search": "Cari produk...",
  "common.loading": "Memuat…",
  "common.chat": "Chat",
  "common.home": "Beranda",

  // Status stok
  "status.available": "Tersedia",
  "status.limited": "Stok Terbatas",
  "status.out": "Habis",

  // Header / nav
  "nav.catalog": "Katalog",
  "nav.promo": "Promo",
  "nav.about": "Tentang Kami",
  "nav.faq": "FAQ",
  "nav.chatAssistant": "Chat dengan Asisten",
  "header.wishlist": "Favorit",
  "header.cart": "Keranjang",
  "header.menu": "Menu",

  // Trust strip (home)
  "trust.shipping.title": "Pengiriman ke Seluruh Indonesia",
  "trust.shipping.desc": "Estimasi & ongkir dikonfirmasi via CS",
  "trust.quality.title": "Produk Original & Berkualitas",
  "trust.quality.desc": "Foto produk nyata, stok jujur",
  "trust.cs.title": "Respons CS Cepat",
  "trust.cs.desc": "Senin–Sabtu, 08.00–21.00 WIB",

  // Home sections
  "home.categories.title": "Belanja per Kategori",
  "home.categories.subtitle": "Temukan perlengkapan sesuai kebutuhan olahragamu.",
  "home.featured.title": "Produk",
  "home.featured.subtitle": "Semua produk olahraga air Luck Sport.",
  "home.cta.title": "Punya pertanyaan sebelum membeli?",
  "home.cta.desc":
    "Tim kami siap membantu memilih produk, cek spesifikasi, dan penawaran. Tinggal chat, beres!",
  "home.cta.button": "Chat CS Sekarang",

  // Hero slides
  "hero.1.eyebrow": "Luck Sport Indonesia",
  "hero.1.title": "Petualangan Olahraga Air Dimulai",
  "hero.1.subtitle":
    "Kayak, kano, perahu, dan papan SUP berkualitas untuk dayung & rekreasi air.",
  "hero.1.cta": "Lihat Perahu",
  "hero.2.eyebrow": "Kayak Single (K1)",
  "hero.2.title": "Kayak K1 — Ringan & Cepat",
  "hero.2.subtitle": "Serat karbon untuk sprint dan latihan. Hubungi CS untuk spesifikasi & harga.",
  "hero.2.cta": "Lihat Produk",
  "hero.3.eyebrow": "Kualitas Teruji",
  "hero.3.title": "Dibuat untuk Juara",
  "hero.3.subtitle": "Produk Luck Sport Indonesia — tangguh, ringan, dan tepercaya.",
  "hero.3.cta": "Lihat Katalog",

  // Catalog
  "catalog.title": "Katalog Produk",
  "catalog.subtitle": "Jelajahi semua perlengkapan olahraga air Luck Sport.",
  "catalog.searchPlaceholder": "Cari produk berdasarkan nama atau kategori...",
  "catalog.category": "Kategori",
  "catalog.price": "Harga",
  "catalog.availability": "Ketersediaan",
  "catalog.inStockOnly": "Hanya tampilkan yang tersedia",
  "catalog.reset": "Reset filter",
  "catalog.filter": "Filter",
  "catalog.showing": "Menampilkan {x} dari {y} produk",
  "catalog.sortBy": "Urutkan",
  "catalog.sort.newest": "Terbaru",
  "catalog.sort.cheapest": "Harga Terendah",
  "catalog.sort.expensive": "Harga Tertinggi",
  "catalog.sort.popular": "Terpopuler",
  "catalog.empty.title": "Produk tidak ditemukan",
  "catalog.empty.desc": "Coba ubah kata kunci atau reset filter.",
  "catalog.showN": "Tampilkan {x} Produk",

  // Product detail
  "pd.color": "Warna",
  "pd.size": "Ukuran",
  "pd.sizeGuide": "Panduan Ukuran",
  "pd.addToFav": "Tambah ke favorit",
  "pd.savedFav": "Tersimpan di favorit",
  "pd.buyWa": "Beli via WhatsApp",
  "pd.notifyStock": "Notifikasi Stok",
  "pd.callForInfo": "Call CS untuk Harga & Info",
  "pd.priceVia": "Harga menyesuaikan — Hubungi CS",
  "pd.view3d": "Lihat 3D",
  "pd.viewPhotos": "Foto",
  "pd.model3dNote": "Model 3D contoh (placeholder). Ganti dengan model asli produk.",
  "pd.added": "Ditambahkan!",
  "pd.relatedTitle": "Pelanggan Juga Menyukai",
  "pd.info.payment": "Pembayaran via transfer bank, dikonfirmasi CS via WhatsApp.",
  "pd.info.hours": "CS aktif Senin–Sabtu, 08.00–21.00 WIB.",
  "pd.restock.q": "Stok habis — mau dikabari saat tersedia lagi?",
  "pd.restock.placeholder": "Nomor WhatsApp atau email",
  "pd.restock.btn": "Kabari Saya",
  "pd.selectSize": "Silakan pilih ukuran terlebih dahulu.",

  // Cart / mini cart
  "cart.title": "Keranjang Belanja",
  "cart.empty.title": "Keranjangmu kosong",
  "cart.empty.desc": "Yuk jelajahi katalog dan temukan gear favoritmu.",
  "cart.startShopping": "Mulai Belanja",
  "cart.continue": "Lanjutkan Belanja",
  "cart.clear": "Kosongkan Keranjang",
  "cart.summary": "Ringkasan Pesanan",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Ongkos kirim",
  "cart.total": "Total",
  "cart.note": "Catatan pesanan (opsional)",
  "cart.notePlaceholder": "Contoh: tolong dikirim sebelum akhir pekan",
  "cart.checkout": "Checkout via WhatsApp",
  "cart.checkoutNote": "Pesananmu akan dikirim sebagai ringkasan otomatis ke CS.",
  "cart.shipEstimate": "Estimasi Ongkir",
  "cart.selectProvince": "Pilih provinsi…",
  "cart.check": "Cek",
  "cart.miniCart": "Keranjang",
  "cart.viewCart": "Lihat Keranjang",
  "cart.shipNote": "Ongkir & konfirmasi stok diproses oleh CS via WhatsApp.",

  // Wishlist
  "wish.title": "Favorit Saya",
  "wish.empty.title": "Belum ada favorit",
  "wish.empty.desc":
    "Tap ikon hati pada produk untuk menyimpannya di sini dan mudah ditemukan nanti.",
  "wish.explore": "Jelajahi Katalog",
  "wish.clear": "Kosongkan",
  "wish.saved": "produk tersimpan",

  // Footer
  "footer.tagline":
    "Perlengkapan olahraga air. Temukan kayak, kano, perahu & papan SUP terbaik untuk performa maksimalmu.",
  "footer.categories": "Kategori",
  "footer.info": "Informasi",
  "footer.cs": "Customer Service",
  "footer.chatCs": "Chat WhatsApp CS",
  "footer.rights": "Semua hak cipta dilindungi.",
  "footer.privacy": "Kebijakan Privasi",
  "footer.terms": "Syarat & Ketentuan",
  "footer.orders": "Riwayat Pesanan",
  "footer.promo": "Promo & Diskon",

  // Chatbot
  "bot.title": "Asisten Luck Sport",
  "bot.online": "Online · balas instan",
  "bot.launcher": "Chat • Balas Instan",
  "bot.placeholder": "Ketik pesan…",
  "bot.wa": "Hubungi CS via WhatsApp",
  "bot.found": "Ini yang saya temukan: 👇",
  "bot.notFound": "Hmm, saya belum menemukan produk itu. Mau lihat katalog lengkap atau terhubung ke CS?",
  "bot.searchError": "Maaf, pencarian sedang bermasalah. Coba hubungi CS ya 🙏",

  // Award homepage experience
  "award.hero.eyebrow": "Danau Jatiluhur · Purwakarta",
  "award.hero.title1": "Mengalun di",
  "award.hero.title2": "Atas Air",
  "award.hero.sub":
    "Kayak, kano, dan perahu buatan tangan — untuk pagi yang tenang di Danau Jatiluhur.",
  "award.hero.cta": "Jelajahi Koleksi",
  "award.hero.cta2": "Hubungi Kami",
  "award.scroll": "Gulir",
  "award.manifesto":
    "Setiap lekuk lambung lahir dari tangan. Setiap kayuhan adalah dialog dengan air. Kami menempa perahu bagi mereka yang berani memecah riak, menaklukkan jarak, dan menyongsong fajar.",
  "award.craft1.title": "Serat Karbon, Sentuhan Tangan",
  "award.craft1.desc":
    "Material aerospace dibentuk perajin lokal — ringan untuk balapan, kuat untuk bertahun-tahun di air.",
  "award.craft2.title": "Dari Danau, untuk Juara",
  "award.craft2.desc":
    "Diuji pendayung nasional di danau Indonesia. Dari latihan pertama hingga garis finis.",
  "award.products.title": "Koleksi",
  "award.products.sub": "Geser untuk menjelajah",
  "award.categories.title": "Jelajah Kategori",
  "award.stats.products": "Produk",
  "award.stats.categories": "Kategori",
  "award.stats.handmade": "Buatan Indonesia",
  "award.stats.assist": "Asisten Online",
  "award.cta.title": "Siap Turun ke Air?",
  "award.cta.sub":
    "Ceritakan kebutuhanmu — tim kami siap merekomendasikan perahu yang tepat.",
  "award.cta.btn": "Lihat Katalog",
  "award.cta.wa": "Chat WhatsApp",
};

const en: Dict = {
  "common.shopNow": "Shop Now",
  "common.viewCatalog": "View Catalog",
  "common.viewAll": "View All",
  "common.viewDetail": "View Detail",
  "common.addToCart": "Add to Cart",
  "common.callCS": "Call CS",
  "common.priceOnRequest": "Contact CS for price",
  "common.outOfStock": "Out of Stock",
  "common.search": "Search products...",
  "common.loading": "Loading…",
  "common.chat": "Chat",
  "common.home": "Home",

  "status.available": "Available",
  "status.limited": "Limited Stock",
  "status.out": "Out of Stock",

  "nav.catalog": "Catalog",
  "nav.promo": "Promo",
  "nav.about": "About Us",
  "nav.faq": "FAQ",
  "nav.chatAssistant": "Chat with Assistant",
  "header.wishlist": "Wishlist",
  "header.cart": "Cart",
  "header.menu": "Menu",

  "trust.shipping.title": "Shipping Across Indonesia",
  "trust.shipping.desc": "Estimate & cost confirmed via CS",
  "trust.quality.title": "Original & Quality Products",
  "trust.quality.desc": "Real product photos, honest stock",
  "trust.cs.title": "Fast CS Response",
  "trust.cs.desc": "Mon–Sat, 8 AM–9 PM (WIB)",

  "home.categories.title": "Shop by Category",
  "home.categories.subtitle": "Find the right gear for your water sport.",
  "home.featured.title": "Products",
  "home.featured.subtitle": "All Luck Sport water-sports products.",
  "home.cta.title": "Questions before you buy?",
  "home.cta.desc":
    "Our team is ready to help you choose, check specs, and get a quote. Just chat with us!",
  "home.cta.button": "Chat CS Now",

  "hero.1.eyebrow": "Luck Sport Indonesia",
  "hero.1.title": "Your Water Adventure Begins",
  "hero.1.subtitle":
    "Quality kayaks, canoes, boats, and SUP boards for paddling & water recreation.",
  "hero.1.cta": "View Boats",
  "hero.2.eyebrow": "Kayak Single (K1)",
  "hero.2.title": "Kayak K1 — Light & Fast",
  "hero.2.subtitle": "Carbon fiber for sprint and training. Contact CS for specs & price.",
  "hero.2.cta": "View Product",
  "hero.3.eyebrow": "Proven Quality",
  "hero.3.title": "Built for Champions",
  "hero.3.subtitle": "Luck Sport Indonesia — tough, light, and trusted.",
  "hero.3.cta": "View Catalog",

  "catalog.title": "Product Catalog",
  "catalog.subtitle": "Browse all Luck Sport water-sports gear.",
  "catalog.searchPlaceholder": "Search products by name or category...",
  "catalog.category": "Category",
  "catalog.price": "Price",
  "catalog.availability": "Availability",
  "catalog.inStockOnly": "Show available only",
  "catalog.reset": "Reset filters",
  "catalog.filter": "Filter",
  "catalog.showing": "Showing {x} of {y} products",
  "catalog.sortBy": "Sort by",
  "catalog.sort.newest": "Newest",
  "catalog.sort.cheapest": "Lowest Price",
  "catalog.sort.expensive": "Highest Price",
  "catalog.sort.popular": "Most Popular",
  "catalog.empty.title": "No products found",
  "catalog.empty.desc": "Try changing keywords or reset filters.",
  "catalog.showN": "Show {x} Products",

  "pd.color": "Color",
  "pd.size": "Size",
  "pd.sizeGuide": "Size Guide",
  "pd.addToFav": "Add to wishlist",
  "pd.savedFav": "Saved to wishlist",
  "pd.buyWa": "Buy via WhatsApp",
  "pd.notifyStock": "Notify Restock",
  "pd.callForInfo": "Call CS for Price & Info",
  "pd.priceVia": "Price on request — Contact CS",
  "pd.view3d": "View 3D",
  "pd.viewPhotos": "Photos",
  "pd.model3dNote": "Sample 3D model (placeholder). Replace with the real product model.",
  "pd.added": "Added!",
  "pd.relatedTitle": "Customers Also Liked",
  "pd.info.payment": "Payment via bank transfer, confirmed by CS on WhatsApp.",
  "pd.info.hours": "CS available Mon–Sat, 8 AM–9 PM (WIB).",
  "pd.restock.q": "Out of stock — want to be notified when available?",
  "pd.restock.placeholder": "WhatsApp number or email",
  "pd.restock.btn": "Notify Me",
  "pd.selectSize": "Please select a size first.",

  "cart.title": "Shopping Cart",
  "cart.empty.title": "Your cart is empty",
  "cart.empty.desc": "Explore the catalog and find your favorite gear.",
  "cart.startShopping": "Start Shopping",
  "cart.continue": "Continue Shopping",
  "cart.clear": "Clear Cart",
  "cart.summary": "Order Summary",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Shipping",
  "cart.total": "Total",
  "cart.note": "Order note (optional)",
  "cart.notePlaceholder": "e.g. please ship before the weekend",
  "cart.checkout": "Checkout via WhatsApp",
  "cart.checkoutNote": "Your order is sent as an auto-generated summary to CS.",
  "cart.shipEstimate": "Shipping Estimate",
  "cart.selectProvince": "Select province…",
  "cart.check": "Check",
  "cart.miniCart": "Cart",
  "cart.viewCart": "View Cart",
  "cart.shipNote": "Shipping & stock confirmed by CS via WhatsApp.",

  "wish.title": "My Wishlist",
  "wish.empty.title": "No favorites yet",
  "wish.empty.desc":
    "Tap the heart icon on a product to save it here for easy access later.",
  "wish.explore": "Explore Catalog",
  "wish.clear": "Clear",
  "wish.saved": "items saved",

  "footer.tagline":
    "Water-sports equipment. Find the best kayaks, canoes, boats & SUP boards for peak performance.",
  "footer.categories": "Categories",
  "footer.info": "Information",
  "footer.cs": "Customer Service",
  "footer.chatCs": "Chat WhatsApp CS",
  "footer.rights": "All rights reserved.",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms & Conditions",
  "footer.orders": "Order History",
  "footer.promo": "Promo & Discounts",

  "bot.title": "Luck Sport Assistant",
  "bot.online": "Online · instant reply",
  "bot.launcher": "Chat • Instant Reply",
  "bot.placeholder": "Type a message…",
  "bot.wa": "Contact CS via WhatsApp",
  "bot.found": "Here's what I found: 👇",
  "bot.notFound": "Hmm, I couldn't find that product. Want to see the full catalog or reach CS?",
  "bot.searchError": "Sorry, search is having issues. Please contact CS 🙏",

  // Award homepage experience
  "award.hero.eyebrow": "Lake Jatiluhur · Purwakarta",
  "award.hero.title1": "Glide Across",
  "award.hero.title2": "Still Waters",
  "award.hero.sub":
    "Handcrafted kayaks, canoes, and boats — for serene mornings on Lake Jatiluhur.",
  "award.hero.cta": "Explore Collection",
  "award.hero.cta2": "Talk to Us",
  "award.scroll": "Scroll",
  "award.manifesto":
    "Every hull is shaped by hand. Every stroke is a dialogue with water. We forge boats for those who dare to break the ripples, conquer the distance, and chase the dawn.",
  "award.craft1.title": "Carbon Fiber, Human Touch",
  "award.craft1.desc":
    "Aerospace materials shaped by local artisans — light enough to race, strong enough for years on the water.",
  "award.craft2.title": "From the Lake, for Champions",
  "award.craft2.desc":
    "Tested by national paddlers on Indonesian lakes. From first training to the finish line.",
  "award.products.title": "The Collection",
  "award.products.sub": "Drag to explore",
  "award.categories.title": "Browse Categories",
  "award.stats.products": "Products",
  "award.stats.categories": "Categories",
  "award.stats.handmade": "Made in Indonesia",
  "award.stats.assist": "Assistant Online",
  "award.cta.title": "Ready to Hit the Water?",
  "award.cta.sub":
    "Tell us what you need — our team will recommend the right boat.",
  "award.cta.btn": "View Catalog",
  "award.cta.wa": "Chat WhatsApp",
};

export const DICT: Record<Lang, Dict> = { id, en };

export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>
): string {
  let s = DICT[lang]?.[key] ?? DICT[DEFAULT_LANG][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return s;
}
