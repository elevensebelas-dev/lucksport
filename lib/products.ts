import type { Product, Category } from "./types";

// Helper untuk membangun URL gambar Unsplash dengan optimasi (WebP, ukuran).
// Di produksi, ini akan diganti CDN Cloudinary/imgix (PRD 7.1) yang mengambil
// dari foto asli yang diunggah tim Lucksport via CMS.
const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;

// Foto produk (verified). Beberapa produk memakai >1 foto untuk galeri.
const PHOTOS = {
  jersey1: "photo-1517466787929-bc90951d0974",
  jersey2: "photo-1577212017184-80cc0da11082",
  jersey3: "photo-1622279457486-62dcc4a431d6",
  jersey4: "photo-1602143407151-7111542de6e8",
  shoeRed: "photo-1542291026-7eec264c27ff",
  shoeWhite: "photo-1600185365926-3a2ce3cdb9eb",
  shoeBlue: "photo-1539185441755-769473a23570",
  shoeRun: "photo-1595950653106-6c9ebd614d3a",
  basket: "photo-1546519638-68e109498ffc",
  sneaker: "photo-1556906781-9a412961c28c",
  gym1: "photo-1517838277536-f5f99be501cd",
  gym2: "photo-1606107557195-0e29a4b5b4aa",
  gym3: "photo-1580087433295-ab2600c1030e",
  shorts: "photo-1614632537190-23e4146777db",
  athlete1: "photo-1571019613454-1cb2f99b2d8b",
  athlete2: "photo-1551698618-1dfe5d97d256",
  athlete3: "photo-1593079831268-3381b0db4a77",
  acc1: "photo-1483721310020-03333e577078",
  acc2: "photo-1535131749006-b7f58c99034b",
  socks: "photo-1565992441121-4367c2967103",
  cap: "photo-1556817411-31ae72fa3ea0",
  boat1: "photo-1544551763-46a013bb70d5",
  boat2: "photo-1559599238-308793637427",
  boat3: "photo-1505577058444-a3dab90d4253",
};

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["39", "40", "41", "42", "43", "44"];

// Bangun varian (SKU per ukuran + warna) dengan stok acak deterministik.
function buildVariants(
  sizes: string[],
  colors: string[],
  stockPattern: number[]
) {
  const variants = [];
  let i = 0;
  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        size,
        color,
        stock: stockPattern[i % stockPattern.length],
      });
      i++;
    }
  }
  return variants;
}

export const products: Product[] = [
  {
    product_id: "11111111-0001",
    slug: "jersey-pro-elite-home",
    name: "Jersey Pro Elite Home",
    category: "Jersey",
    description:
      "Jersey resmi tim dengan teknologi Dri-FIT yang menyerap keringat dan cepat kering. Bahan polyester ringan dengan ventilasi mesh di punggung untuk sirkulasi udara maksimal. Cocok untuk pertandingan maupun latihan intens.",
    price: 189000,
    price_original: 249000,
    images: [img(PHOTOS.jersey1), img(PHOTOS.jersey3), img(PHOTOS.jersey4)],
    variants: buildVariants(APPAREL_SIZES, ["Merah", "Biru"], [12, 8, 5, 0, 3]),
    badges: ["best_seller", "sale"],
    is_active: true,
    created_at: "2025-04-01T08:00:00Z",
    updated_at: "2025-05-20T08:00:00Z",
  },
  {
    product_id: "11111111-0002",
    slug: "jersey-classic-stripe",
    name: "Jersey Classic Stripe",
    category: "Jersey",
    description:
      "Desain klasik bergaris dengan potongan reguler fit yang nyaman dipakai sehari-hari maupun saat berolahraga. Bahan adem dan tidak mudah luntur. Tersedia dalam beberapa pilihan warna.",
    price: 159000,
    price_original: null,
    images: [img(PHOTOS.jersey2), img(PHOTOS.jersey1)],
    variants: buildVariants(APPAREL_SIZES, ["Putih", "Hitam"], [10, 10, 6, 4, 2]),
    badges: ["new"],
    is_active: true,
    created_at: "2025-05-10T08:00:00Z",
    updated_at: "2025-05-22T08:00:00Z",
  },
  {
    product_id: "22222222-0001",
    slug: "sepatu-runner-x-speed",
    name: "Sepatu Runner X-Speed",
    category: "Sepatu",
    description:
      "Sepatu lari dengan bantalan empuk responsif dan outsole karet anti-slip. Upper berbahan knit yang fleksibel mengikuti bentuk kaki. Ringan, hanya 230 gram, ideal untuk lari jarak jauh.",
    price: 459000,
    price_original: 599000,
    images: [img(PHOTOS.shoeRed), img(PHOTOS.shoeRun), img(PHOTOS.sneaker)],
    variants: buildVariants(SHOE_SIZES, ["Merah", "Hitam"], [6, 9, 7, 3, 0, 4]),
    badges: ["best_seller", "sale"],
    is_active: true,
    created_at: "2025-03-15T08:00:00Z",
    updated_at: "2025-05-18T08:00:00Z",
  },
  {
    product_id: "22222222-0002",
    slug: "sepatu-court-grip-basket",
    name: "Sepatu Court Grip Basket",
    category: "Sepatu",
    description:
      "Sepatu basket dengan ankle support tinggi dan daya cengkeram superior di lapangan indoor. Midsole busa EVA meredam benturan saat melompat. Dirancang untuk pergerakan cepat dan perubahan arah mendadak.",
    price: 529000,
    price_original: null,
    images: [img(PHOTOS.basket), img(PHOTOS.shoeBlue)],
    variants: buildVariants(SHOE_SIZES, ["Putih", "Biru"], [4, 6, 8, 5, 2, 0]),
    badges: ["new"],
    is_active: true,
    created_at: "2025-05-05T08:00:00Z",
    updated_at: "2025-05-21T08:00:00Z",
  },
  {
    product_id: "22222222-0003",
    slug: "sepatu-daily-trainer",
    name: "Sepatu Daily Trainer",
    category: "Sepatu",
    description:
      "Sepatu training serbaguna untuk gym, angkat beban, dan latihan fungsional. Sol datar stabil memberi pijakan kokoh. Desain minimalis yang cocok dipakai kasual.",
    price: 389000,
    price_original: 449000,
    images: [img(PHOTOS.shoeWhite), img(PHOTOS.sneaker)],
    variants: buildVariants(SHOE_SIZES, ["Putih", "Abu"], [8, 8, 6, 4, 3, 2]),
    badges: ["sale"],
    is_active: true,
    created_at: "2025-04-20T08:00:00Z",
    updated_at: "2025-05-19T08:00:00Z",
  },
  {
    product_id: "33333333-0001",
    slug: "celana-training-flex",
    name: "Celana Training Flex",
    category: "Celana",
    description:
      "Celana training panjang dengan bahan stretch 4 arah yang mengikuti gerakan tubuh. Dilengkapi kantong samping berritsleting untuk menyimpan ponsel. Pinggang elastis dengan tali serut.",
    price: 179000,
    price_original: null,
    images: [img(PHOTOS.gym1), img(PHOTOS.gym3)],
    variants: buildVariants(APPAREL_SIZES, ["Hitam", "Navy"], [9, 9, 7, 5, 3]),
    badges: ["best_seller"],
    is_active: true,
    created_at: "2025-04-12T08:00:00Z",
    updated_at: "2025-05-17T08:00:00Z",
  },
  {
    product_id: "33333333-0002",
    slug: "celana-pendek-active-dry",
    name: "Celana Pendek Active Dry",
    category: "Celana",
    description:
      "Celana pendek olahraga ringan dengan lapisan dalam (inner) untuk kenyamanan ekstra. Bahan quick-dry yang sempurna untuk futsal, lari, dan latihan harian. Panjang 5 inci di atas lutut.",
    price: 119000,
    price_original: 149000,
    images: [img(PHOTOS.shorts), img(PHOTOS.gym2)],
    variants: buildVariants(APPAREL_SIZES, ["Hitam", "Hijau"], [12, 10, 8, 6, 4]),
    badges: ["sale", "new"],
    is_active: true,
    created_at: "2025-05-08T08:00:00Z",
    updated_at: "2025-05-23T08:00:00Z",
  },
  {
    product_id: "33333333-0003",
    slug: "celana-jogger-everyday",
    name: "Celana Jogger Everyday",
    category: "Celana",
    description:
      "Jogger berbahan cotton-fleece lembut dengan potongan tapered yang modern. Nyaman untuk pemanasan, recovery, maupun santai. Karet di bagian pergelangan kaki.",
    price: 199000,
    price_original: null,
    images: [img(PHOTOS.gym3), img(PHOTOS.gym1)],
    variants: buildVariants(APPAREL_SIZES, ["Abu", "Hitam"], [7, 7, 5, 3, 0]),
    badges: [],
    is_active: true,
    created_at: "2025-04-28T08:00:00Z",
    updated_at: "2025-05-16T08:00:00Z",
  },
  {
    product_id: "44444444-0001",
    slug: "kaos-kaki-pro-cushion",
    name: "Kaos Kaki Pro Cushion (3 Pasang)",
    category: "Aksesori",
    description:
      "Paket isi 3 pasang kaos kaki olahraga dengan bantalan ekstra di tumit dan telapak. Bahan combed cotton yang menyerap keringat dan mengurangi lecet. Cocok untuk semua jenis olahraga.",
    price: 79000,
    price_original: 99000,
    images: [img(PHOTOS.socks), img(PHOTOS.acc1)],
    variants: buildVariants(["All Size"], ["Putih", "Hitam", "Abu"], [20, 15, 10]),
    badges: ["sale", "best_seller"],
    is_active: true,
    created_at: "2025-04-02T08:00:00Z",
    updated_at: "2025-05-15T08:00:00Z",
  },
  {
    product_id: "44444444-0002",
    slug: "topi-sport-cap-dryfit",
    name: "Topi Sport Cap Dry-Fit",
    category: "Aksesori",
    description:
      "Topi olahraga dengan bahan ringan menyerap keringat dan strap belakang yang dapat disesuaikan. Brim melengkung melindungi dari sinar matahari saat aktivitas outdoor.",
    price: 89000,
    price_original: null,
    images: [img(PHOTOS.cap), img(PHOTOS.acc2)],
    variants: buildVariants(["All Size"], ["Hitam", "Navy", "Putih"], [14, 9, 6]),
    badges: ["new"],
    is_active: true,
    created_at: "2025-05-12T08:00:00Z",
    updated_at: "2025-05-24T08:00:00Z",
  },
  {
    product_id: "44444444-0003",
    slug: "tas-gym-duffel-compact",
    name: "Tas Gym Duffel Compact",
    category: "Aksesori",
    description:
      "Tas duffel berkapasitas 25L dengan kompartemen sepatu terpisah dan saku basah. Bahan polyester tahan air dengan tali bahu empuk. Ukuran ideal untuk dibawa ke gym atau lapangan.",
    price: 229000,
    price_original: 289000,
    images: [img(PHOTOS.acc2), img(PHOTOS.acc1)],
    variants: buildVariants(["All Size"], ["Hitam", "Biru"], [8, 5]),
    badges: ["sale"],
    is_active: true,
    created_at: "2025-04-18T08:00:00Z",
    updated_at: "2025-05-14T08:00:00Z",
  },
  {
    product_id: "11111111-0003",
    slug: "jersey-training-mesh",
    name: "Jersey Training Mesh",
    category: "Jersey",
    description:
      "Jersey latihan berbahan full-mesh yang sangat breathable. Potongan athletic fit menonjolkan kenyamanan bergerak. Pilihan utama komunitas futsal untuk seragam tim.",
    price: 139000,
    price_original: null,
    images: [img(PHOTOS.jersey4), img(PHOTOS.athlete1), img(PHOTOS.jersey2)],
    variants: buildVariants(APPAREL_SIZES, ["Hijau", "Oranye"], [15, 12, 9, 6, 3]),
    badges: ["best_seller"],
    is_active: true,
    created_at: "2025-03-30T08:00:00Z",
    updated_at: "2025-05-13T08:00:00Z",
  },
  {
    product_id: "55555555-0001",
    slug: "perahu-dayung-fiber-pro",
    name: "Perahu Dayung Fiber Pro",
    category: "Perahu",
    description:
      "Perahu dayung berbahan fiberglass kuat dan ringan, kapasitas 2-3 orang. Cocok untuk olahraga dayung, memancing, maupun rekreasi air. Tersedia beberapa ukuran & warna. Harga menyesuaikan spesifikasi — silakan hubungi CS kami untuk penawaran dan ketersediaan.",
    price: 0,
    price_original: null,
    images: [img(PHOTOS.boat1), img(PHOTOS.boat2), img(PHOTOS.boat3)],
    variants: [
      { size: "2 Orang", color: "Biru", stock: 2 },
      { size: "3 Orang", color: "Merah", stock: 1 },
    ],
    badges: ["new"],
    is_active: true,
    created_at: "2025-05-25T08:00:00Z",
    updated_at: "2025-05-25T08:00:00Z",
  },
];

// ── Query helpers (memodelkan layer data; di produksi diganti CMS/API) ──

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.is_active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.is_active);
}

export function getProductsByCategory(category: Category): Product[] {
  return getActiveProducts().filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getActiveProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return getActiveProducts()
    .filter((p) => p.badges.length > 0)
    .slice(0, limit);
}

// Total stok lintas varian — untuk indikator ketersediaan.
export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

// Kategori yang harganya tidak ditampilkan — pelanggan diarahkan menghubungi CS
// (mis. Perahu, produk high-ticket / harga menyesuaikan spesifikasi).
export const CALL_FOR_PRICE_CATEGORIES: Category[] = ["Perahu"];

export function isCallForPrice(product: Product): boolean {
  return CALL_FOR_PRICE_CATEGORIES.includes(product.category);
}

export function isCallForPriceCategory(category: Category | string): boolean {
  return (CALL_FOR_PRICE_CATEGORIES as string[]).includes(category);
}

export type StockStatus = "Tersedia" | "Stok Terbatas" | "Habis";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "Habis";
  if (stock <= 5) return "Stok Terbatas";
  return "Tersedia";
}

export const CATEGORIES: {
  name: Category;
  slug: string;
  description: string;
  image: string;
}[] = [
  {
    name: "Jersey",
    slug: "jersey",
    description: "Jersey tim & latihan",
    image: img(PHOTOS.jersey1, 800),
  },
  {
    name: "Sepatu",
    slug: "sepatu",
    description: "Lari, basket & training",
    image: img(PHOTOS.shoeRed, 800),
  },
  {
    name: "Celana",
    slug: "celana",
    description: "Training, jogger & pendek",
    image: img(PHOTOS.shorts, 800),
  },
  {
    name: "Aksesori",
    slug: "aksesori",
    description: "Topi, tas & kaos kaki",
    image: img(PHOTOS.acc2, 800),
  },
  {
    name: "Perahu",
    slug: "perahu",
    description: "Perahu & olahraga air",
    image: img(PHOTOS.boat1, 800),
  },
];

export function formatIDR(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}
