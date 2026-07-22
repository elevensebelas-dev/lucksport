"use client";

import { useEffect, useRef } from "react";

// Latar hero: montase video promosi Luck Sport (4 klip, crossfade, loop 35s).
// Menggantikan animasi 3D LakeScene — video nyata produk lebih menjual.
//
// - Autoplay muted + playsInline (syarat autoplay iOS/Android).
// - prefers-reduced-motion: video dijeda, poster tetap tampil.
// - Scrim gradien gelap menjaga teks hero tetap terbaca di semua adegan.
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) video.pause();
      // play() bisa ditolak browser (mis. data saver) — abaikan, poster tampil.
      else video.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);

    // Autoplay kadang ditolak/dijeda (iOS hemat baterai, tab sempat blur).
    // Coba lanjutkan lagi saat tab kembali aktif atau ada sentuhan pertama.
    const resume = () => {
      if (!mq.matches && video.paused) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pointerdown", resume, { passive: true });

    return () => {
      mq.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pointerdown", resume);
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/products/hero-montage.mp4"
        poster="/products/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Scrim: gelapkan sisi atas & bawah agar judul dan CTA selalu kontras */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/25 to-slate-950/70" />
      <div className="absolute inset-0 bg-slate-950/10" />
    </div>
  );
}
