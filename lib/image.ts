// Blur placeholder (shimmer) untuk next/image — optimasi loading lanjutan
// (PRD §9 Fase 2). Menampilkan gradien animasi saat foto dimuat.

function shimmer(w: number, h: number): string {
  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e2e8f0" offset="20%" />
      <stop stop-color="#f1f5f9" offset="50%" />
      <stop stop-color="#e2e8f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e2e8f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.4s" repeatCount="indefinite" />
</svg>`;
}

const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

// blurDataURL siap pakai untuk placeholder="blur".
export const blurDataURL = `data:image/svg+xml;base64,${toBase64(
  shimmer(700, 700)
)}`;
