import JsonLd from "@/components/JsonLd";
import HomeExperience from "@/components/award/HomeExperience";
import { getActiveProducts } from "@/lib/store";
import { STORE } from "@/lib/config";

// Dirender saat diminta, bukan saat build: data katalog ada di database,
// sehingga build tidak boleh bergantung pada koneksi DB (build Vercel pernah
// gagal karena query saat build menggantung/timeout).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();
  const base = `https://${STORE.domain}`;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STORE.name,
    url: base,
    description: `${STORE.tagline} — kayak, kano, perahu karet & SUP.`,
    sameAs: [STORE.instagramUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Indonesian",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STORE.name,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/katalog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <JsonLd data={websiteLd} />
      <HomeExperience products={products} />
    </>
  );
}
