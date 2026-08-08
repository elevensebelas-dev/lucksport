// Konten halaman kategori (SEO).
//
// Halaman /kayak, /kano, /perahu-karet, /sup menangkap pencarian seperti
// "jual kayak", "harga kano fiberglass", "perahu karet Purwakarta" — kueri
// yang tidak tertangkap /katalog?kategori=… karena parameter query lemah di
// mata mesin pencari dan tidak punya konten khas per kategori.
import type { Category } from "./types";

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface CategoryContent {
  slug: string;
  category: Category;
  /** Judul H1 — memuat kata kunci pencarian, bukan sekadar nama kategori. */
  h1: { id: string; en: string };
  /** Judul tab & <title> mesin pencari. */
  metaTitle: { id: string; en: string };
  metaDescription: { id: string; en: string };
  /** Paragraf pembuka: unik per kategori (konten tipis = peringkat buruk). */
  intro: { id: string; en: string };
  faq: { id: CategoryFaq[]; en: CategoryFaq[] };
}

export const CATEGORY_CONTENT: CategoryContent[] = [
  {
    slug: "kayak",
    category: "Kayak",
    h1: {
      id: "Jual Kayak — Buatan Perajin Indonesia",
      en: "Kayaks for Sale — Handcrafted in Indonesia",
    },
    metaTitle: {
      id: "Jual Kayak Carbon & Fiberglass | Luck Sport Purwakarta",
      en: "Carbon & Fiberglass Kayaks for Sale | Luck Sport Purwakarta",
    },
    metaDescription: {
      id: "Kayak K1, K2, K4, dan slalom buatan tangan Luck Sport. Carbon fiber & fiberglass, diuji langsung di Danau Jatiluhur. Konsultasi harga via WhatsApp.",
      en: "Handcrafted K1, K2, K4, and slalom kayaks by Luck Sport. Carbon fiber & fiberglass, tested on Lake Jatiluhur. Ask for pricing via WhatsApp.",
    },
    intro: {
      id: "Luck Sport membuat kayak balap dan rekreasi di Purwakarta, Jawa Barat — mulai dari K1 tunggal hingga K4 empat pendayung, serta kayak slalom untuk arus deras. Setiap lambung dibentuk tangan dari carbon fiber atau fiberglass, lalu diuji langsung di Danau Jatiluhur sebelum dikirim. Karena dibuat per pesanan, ukuran kokpit, kekakuan lambung, dan warna dapat disesuaikan dengan berat serta gaya dayung Anda.",
      en: "Luck Sport builds racing and recreational kayaks in Purwakarta, West Java — from single K1 hulls to four-paddler K4s, plus slalom kayaks for whitewater. Every hull is shaped by hand in carbon fiber or fiberglass, then tested on Lake Jatiluhur before it ships. Because each boat is made to order, cockpit size, hull stiffness, and colour can be matched to your weight and paddling style.",
    },
    faq: {
      id: [
        {
          q: "Berapa harga kayak Luck Sport?",
          a: "Harga menyesuaikan spesifikasi — material (carbon fiber atau fiberglass), jumlah kokpit, dan tingkat penyelesaian. Hubungi kami via WhatsApp dengan kebutuhan Anda, kami kirim penawaran rinci.",
        },
        {
          q: "Apa beda kayak carbon fiber dan fiberglass?",
          a: "Carbon fiber jauh lebih ringan dan kaku, sehingga lebih cepat dan responsif — pilihan atlet kompetisi. Fiberglass lebih berat namun lebih tahan benturan dan lebih terjangkau, cocok untuk latihan harian dan rekreasi.",
        },
        {
          q: "Apakah bisa kirim ke luar Purwakarta?",
          a: "Bisa. Kami rutin mengirim ke seluruh Indonesia. Karena kayak berukuran panjang, ongkos kirim dihitung tersendiri sesuai tujuan dan dimensi — akan kami informasikan bersama penawaran harga.",
        },
      ],
      en: [
        {
          q: "How much does a Luck Sport kayak cost?",
          a: "Pricing follows the spec — material (carbon fiber or fiberglass), number of cockpits, and finish level. Message us on WhatsApp with your requirements and we will send a detailed quote.",
        },
        {
          q: "Carbon fiber or fiberglass — what is the difference?",
          a: "Carbon fiber is far lighter and stiffer, so it is faster and more responsive — the choice of competitive athletes. Fiberglass is heavier but more impact-resistant and more affordable, ideal for daily training and recreation.",
        },
        {
          q: "Do you ship outside Purwakarta?",
          a: "Yes. We ship across Indonesia regularly. Because kayaks are long, shipping is quoted separately based on destination and dimensions — we include it with your price quote.",
        },
      ],
    },
  },
  {
    slug: "kano",
    category: "Kano",
    h1: {
      id: "Jual Kano & Canoe — C1, C2, dan Outrigger",
      en: "Canoes for Sale — C1, C2, and Outrigger",
    },
    metaTitle: {
      id: "Jual Kano C1, C2 & Outrigger Canoe | Luck Sport",
      en: "C1, C2 & Outrigger Canoes for Sale | Luck Sport",
    },
    metaDescription: {
      id: "Kano balap C1 dan C2 serta outrigger canoe buatan tangan Luck Sport, Purwakarta. Carbon fiber & fiberglass. Konsultasi spesifikasi via WhatsApp.",
      en: "Handcrafted C1 and C2 racing canoes plus outrigger canoes by Luck Sport, Purwakarta. Carbon fiber & fiberglass. Discuss specs via WhatsApp.",
    },
    intro: {
      id: "Kano Luck Sport dirancang untuk posisi mendayung berlutut khas canoe sprint — tersedia C1 untuk pendayung tunggal, C2 untuk berpasangan, hingga outrigger canoe dengan cadik yang memberi kestabilan ekstra di perairan terbuka. Lambungnya ramping dan panjang untuk meluncur efisien, dibentuk tangan di bengkel kami di Purwakarta. Kami juga melayani pesanan untuk klub dan tim daerah dengan warna serta logo khusus.",
      en: "Luck Sport canoes are built for the kneeling stance of canoe sprint — C1 for solo paddlers, C2 for pairs, and outrigger canoes whose ama adds stability on open water. The hulls are long and narrow for efficient glide, shaped by hand in our Purwakarta workshop. We also take club and regional-team orders with custom colours and logos.",
    },
    faq: {
      id: [
        {
          q: "Apa beda kano dengan kayak?",
          a: "Pada kano, pendayung berlutut atau duduk tinggi dan memakai dayung berbilah satu; pada kayak, pendayung duduk dengan kaki lurus ke depan dan memakai dayung berbilah dua. Bentuk lambung dan posisi kokpitnya pun berbeda.",
        },
        {
          q: "Outrigger canoe cocok untuk pemula?",
          a: "Sangat cocok. Cadik (ama) di sisi lambung membuat perahu jauh lebih stabil dan sulit terbalik, sehingga aman untuk yang baru belajar maupun untuk perairan berombak.",
        },
        {
          q: "Bisakah memesan untuk klub atau tim?",
          a: "Bisa. Kami rutin mengerjakan pesanan klub dan tim daerah, termasuk penyeragaman warna, logo, dan spesifikasi antar unit. Hubungi kami untuk membahas jumlah dan jadwal produksi.",
        },
      ],
      en: [
        {
          q: "How is a canoe different from a kayak?",
          a: "In a canoe you kneel or sit high and use a single-blade paddle; in a kayak you sit with legs forward and use a double-blade paddle. The hull shape and cockpit layout differ accordingly.",
        },
        {
          q: "Is an outrigger canoe good for beginners?",
          a: "Very much so. The ama on the side makes the boat far more stable and hard to capsize, which suits new paddlers and choppy open water alike.",
        },
        {
          q: "Can we order for a club or team?",
          a: "Yes. We regularly handle club and regional-team orders, including matched colours, logos, and specs across units. Contact us to discuss quantity and production schedule.",
        },
      ],
    },
  },
  {
    slug: "perahu-karet",
    category: "Perahu Karet",
    h1: {
      id: "Jual Perahu Karet — Rafting & Penyelamatan",
      en: "Inflatable Boats for Sale — Rafting & Rescue",
    },
    metaTitle: {
      id: "Jual Perahu Karet Rafting & Rescue | Luck Sport",
      en: "Inflatable Rafting & Rescue Boats | Luck Sport",
    },
    metaDescription: {
      id: "Perahu karet Luck Sport untuk arung jeram, wisata air, dan tim penyelamat. Bahan tebal, jahitan kuat, mudah diangkut. Tanya harga via WhatsApp.",
      en: "Luck Sport inflatable boats for rafting, water tourism, and rescue teams. Heavy-duty fabric, strong seams, easy to transport. Ask pricing via WhatsApp.",
    },
    intro: {
      id: "Perahu karet Luck Sport dibuat untuk pemakaian berat: arung jeram, operator wisata air, dan tim SAR. Materialnya tebal dengan jahitan dan lem yang diperkuat pada titik tekanan, serta ruang udara terpisah sehingga tetap mengapung meski satu ruang bocor. Karena dapat dikempiskan, perahu ini mudah diangkut ke lokasi yang sulit dijangkau kendaraan besar — pilihan praktis untuk sungai dan danau di pedalaman.",
      en: "Luck Sport inflatable boats are built for hard use: whitewater rafting, water-tourism operators, and search-and-rescue teams. The fabric is heavy-duty with reinforced seams and glue at stress points, and separate air chambers keep the boat afloat even if one chamber is punctured. Because they deflate, they are easy to carry into places large vehicles cannot reach — practical for inland rivers and lakes.",
    },
    faq: {
      id: [
        {
          q: "Berapa kapasitas perahu karet Luck Sport?",
          a: "Tergantung ukuran yang dipesan — umumnya 4 hingga 8 orang untuk keperluan rafting dan wisata. Sebutkan rencana pemakaian Anda, kami sarankan ukuran yang sesuai.",
        },
        {
          q: "Apakah aman untuk arung jeram?",
          a: "Ya. Perahu dirancang dengan ruang udara terpisah dan bahan tahan gesekan batu, sehingga tetap mengapung dan terkendali bila satu ruang bocor. Kami sarankan tetap melengkapi awak dengan pelampung dan helm standar.",
        },
        {
          q: "Bagaimana perawatannya?",
          a: "Bilas dengan air tawar setelah dipakai, keringkan sebelum disimpan, dan hindari menyimpan dalam keadaan terlipat terlalu lama di tempat panas. Kami sertakan panduan perawatan dan tambalan darurat bersama setiap unit.",
        },
      ],
      en: [
        {
          q: "What capacity do Luck Sport inflatable boats have?",
          a: "It depends on the size ordered — typically 4 to 8 people for rafting and tourism use. Tell us your intended use and we will recommend a suitable size.",
        },
        {
          q: "Are they safe for whitewater rafting?",
          a: "Yes. They use separate air chambers and abrasion-resistant fabric, so the boat stays afloat and controllable if one chamber is punctured. We still recommend standard buoyancy aids and helmets for the crew.",
        },
        {
          q: "How should they be maintained?",
          a: "Rinse with fresh water after use, dry before storage, and avoid leaving them folded for long periods in hot places. A care guide and emergency patch kit come with every unit.",
        },
      ],
    },
  },
  {
    slug: "sup",
    category: "SUP",
    h1: {
      id: "Jual Papan SUP — Stand Up Paddle Board",
      en: "Stand Up Paddle Boards for Sale",
    },
    metaTitle: {
      id: "Jual Papan SUP / Stand Up Paddle Board | Luck Sport",
      en: "Stand Up Paddle Boards (SUP) for Sale | Luck Sport",
    },
    metaDescription: {
      id: "Papan SUP Luck Sport untuk pemula hingga mahir. Stabil, ringan, cocok untuk danau dan pantai tenang. Konsultasi ukuran & harga via WhatsApp.",
      en: "Luck Sport stand up paddle boards for beginners to advanced paddlers. Stable, light, ideal for lakes and calm coastlines. Ask sizing & pricing via WhatsApp.",
    },
    intro: {
      id: "Stand up paddle board (SUP) adalah cara paling mudah memulai olahraga air — Anda berdiri di atas papan dan mendayung dengan dayung panjang. Papan SUP Luck Sport dibuat lebar dan stabil untuk pemula, dengan pilihan lebih ramping bagi yang mengejar kecepatan. Danau Jatiluhur yang tenang menjadikannya ideal untuk latihan pertama, sekaligus tempat kami menguji setiap papan sebelum dikirim.",
      en: "Stand up paddle boarding is the easiest way into water sports — you stand on the board and propel yourself with a long paddle. Luck Sport SUP boards are built wide and stable for beginners, with narrower options for those chasing speed. The calm water of Lake Jatiluhur makes it ideal for a first session, and it is where we test every board before it ships.",
    },
    faq: {
      id: [
        {
          q: "Apakah SUP sulit dipelajari?",
          a: "Tidak. Kebanyakan orang sudah bisa berdiri dan mendayung stabil dalam satu sesi pertama, apalagi di perairan tenang seperti Danau Jatiluhur. Kuncinya memilih papan yang cukup lebar untuk berat badan Anda.",
        },
        {
          q: "Ukuran papan apa yang cocok untuk saya?",
          a: "Papan yang lebih lebar dan tebal memberi daya apung serta kestabilan lebih — cocok untuk pemula dan pendayung berbadan besar. Papan lebih ramping lebih cepat tapi menuntut keseimbangan. Sebutkan tinggi dan berat Anda, kami sarankan ukurannya.",
        },
        {
          q: "Perlu perlengkapan tambahan apa?",
          a: "Minimal dayung SUP, leash pengaman yang menghubungkan Anda ke papan, dan pelampung. Kami dapat menyertakan paket perlengkapan bersama pemesanan papan.",
        },
      ],
      en: [
        {
          q: "Is SUP hard to learn?",
          a: "No. Most people can stand and paddle steadily within their first session, especially on calm water like Lake Jatiluhur. The key is choosing a board wide enough for your weight.",
        },
        {
          q: "What board size suits me?",
          a: "Wider, thicker boards give more buoyancy and stability — ideal for beginners and heavier paddlers. Narrower boards are faster but demand better balance. Tell us your height and weight and we will recommend a size.",
        },
        {
          q: "What extra gear do I need?",
          a: "At minimum a SUP paddle, a safety leash connecting you to the board, and a buoyancy aid. We can include a gear bundle with your board order.",
        },
      ],
    },
  },
];

export function findCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT.find((c) => c.slug === slug);
}
