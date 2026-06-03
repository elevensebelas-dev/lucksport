// Integrasi Google Analytics 4 & Meta Pixel (PRD §9 Fase 2).
// Hanya dimuat jika ID disetel via environment variable, sehingga aman
// di lingkungan dev/preview (tanpa ID → tidak memuat apa pun).
//
//   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
//   NEXT_PUBLIC_META_PIXEL_ID=000000000000000
import Script from "next/script";

export default function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {/* Google Analytics 4 */}
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga}');
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixel}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
