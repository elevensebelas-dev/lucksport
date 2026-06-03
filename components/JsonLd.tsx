// Menyisipkan structured data JSON-LD (PRD §9 Fase 2 — SEO).
// Membantu Google menampilkan rich result (harga, ketersediaan, breadcrumb).

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Aman: data berasal dari sumber tepercaya (data produk kita sendiri).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
