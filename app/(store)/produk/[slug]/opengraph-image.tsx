// Kartu share dinamis per produk (1200×630).
//
// Dipakai saat link produk dibagikan ke WhatsApp/Instagram/Facebook. Karena
// penjualan Luck Sport berjalan lewat WhatsApp, tampilan link adalah etalase
// kedua — sebelumnya hanya logo polos untuk semua produk.
import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/store";
import { SITE_URL, STORE } from "@/lib/config";

// Driver postgres memakai socket TCP → wajib runtime Node, bukan edge.
export const runtime = "nodejs";

export const alt = `${STORE.name} — ${STORE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Foto produk bisa berupa path lokal ("/gambar-ls/..") atau URL Blob absolut.
function absolute(src: string): string {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const title = product?.name ?? STORE.name;
  const category = product?.category ?? "Olahraga Air";
  const photo = product?.images?.[0]
    ? absolute(product.images[0])
    : `${SITE_URL}/brand/logo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
        }}
      >
        {/* ── Foto produk (atas) ──
            Panel teks di bawahnya dibuat SOLID, bukan gradasi transparan:
            foto katalog Luck Sport berlatar putih, sehingga teks putih di atas
            gradasi tipis menjadi tak terbaca. */}
        <div
          style={{
            display: "flex",
            width: "1200px",
            height: "352px",
            position: "relative",
            // Putih agar menyatu dengan foto katalog yang berlatar putih —
            // area kosong di kiri-kanan jadi tak terlihat sebagai kotak.
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* `contain`, bukan `cover`: foto katalog beragam rasio (persegi &
              16:9). Dengan cover, perahu pada foto persegi terpotong. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            width={1200}
            height={352}
            style={{ width: "1200px", height: "352px", objectFit: "contain" }}
          />
          {/* Kategori mengambang di sudut foto */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "56px",
              display: "flex",
              padding: "10px 22px",
              borderRadius: "9999px",
              backgroundColor: "rgba(15,23,42,0.82)",
              color: "#fde68a",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            {category.toUpperCase()}
          </div>
        </div>

        {/* Garis aksen emas sebagai pemisah */}
        <div
          style={{
            display: "flex",
            width: "1200px",
            height: "5px",
            backgroundColor: "#fbbf24",
          }}
        />

        {/* ── Panel teks (bawah) — selalu kontras ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "1200px",
            height: "273px",
            padding: "0 56px",
            backgroundColor: "#0f172a",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "0.18em",
              }}
            >
              LUCK SPORT
            </div>
            <div
              style={{
                display: "flex",
                width: "5px",
                height: "5px",
                borderRadius: "9999px",
                backgroundColor: "#fbbf24",
              }}
            />
            <div style={{ display: "flex", fontSize: 22, color: "#94a3b8" }}>
              Danau Jatiluhur, Purwakarta
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 52 : 62,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              maxWidth: "1090px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "11px 26px",
                borderRadius: "9999px",
                backgroundColor: "#25D366",
                color: "#052e16",
                fontSize: 25,
                fontWeight: 700,
              }}
            >
              Konsultasi via WhatsApp
            </div>
            <div style={{ display: "flex", fontSize: 23, color: "#94a3b8" }}>
              Buatan tangan perajin Indonesia
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
