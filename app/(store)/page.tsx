import JsonLd from "@/components/JsonLd";
import HomeExperience from "@/components/award/HomeExperience";
import { getActiveProducts } from "@/lib/store";
import { STORE } from "@/lib/config";

export default function HomePage() {
  const products = getActiveProducts();
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
