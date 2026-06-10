"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "./Icons";
import { blurDataURL } from "@/lib/image";
import { useLang } from "@/context/LanguageContext";

interface Slide {
  type?: "image" | "video"; // default: image
  image: string; // foto (untuk slide gambar) / poster (untuk slide video)
  video?: string; // URL video (mp4/webm) bila type === "video"
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
}

// Cara menambah slide VIDEO:
//   1. Taruh file di public/products/, mis. hero-1.mp4 (disarankan < 10MB,
//      720p/1080p, sudah dikompres). Sertakan juga poster gambar (frame awal).
//   2. Tambahkan slide dengan: type: "video", video: "/products/hero-1.mp4",
//      image: "/products/hero-1-poster.jpg" (poster/fallback).
// Slide video diputar tanpa suara (autoplay browser butuh muted) dan slider
// otomatis lanjut setelah video selesai.
const SLIDES: Slide[] = [
  {
    type: "video",
    video: "/products/hero-1.mp4",
    image: "/products/hero-1.jpg", // poster/fallback
    eyebrow: "hero.1.eyebrow",
    title: "hero.1.title",
    subtitle: "hero.1.subtitle",
    cta: { label: "hero.1.cta", href: "/katalog?kategori=perahu" },
  },
  {
    type: "video",
    video: "/products/hero-2.mp4",
    image: "/products/hero-2.jpg",
    eyebrow: "hero.2.eyebrow",
    title: "hero.2.title",
    subtitle: "hero.2.subtitle",
    cta: { label: "hero.2.cta", href: "/produk/luck-sport-kayak-single-k1-carbon-fiber" },
  },
  {
    type: "video",
    video: "/products/hero-3.mp4",
    image: "/products/hero-3.jpg",
    eyebrow: "hero.3.eyebrow",
    title: "hero.3.title",
    subtitle: "hero.3.subtitle",
    cta: { label: "hero.3.cta", href: "/katalog" },
  },
];

const INTERVAL = 4000; // autoplay 4 detik untuk slide gambar (PRD 5.1.1)

function isVideo(slide: Slide): boolean {
  return slide.type === "video" && !!slide.video;
}

export default function HeroSlider() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  // Reset video ke awal setiap kali slide-nya menjadi aktif.
  useEffect(() => {
    const v = videoRefs.current[index];
    if (v && isVideo(SLIDES[index])) v.currentTime = 0;
  }, [index]);

  // Auto-advance: slide gambar pakai timer; slide video lanjut saat selesai.
  useEffect(() => {
    // Jeda semua video non-aktif.
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) v.pause();
    });

    const active = videoRefs.current[index];

    if (paused) {
      if (active) active.pause();
      return;
    }

    if (isVideo(SLIDES[index])) {
      if (active) active.play().catch(() => {});
      return; // pindah slide ditangani oleh onEnded
    }

    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  return (
    <section
      className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner produk unggulan"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          {isVideo(slide) ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              poster={slide.image}
              onEnded={next}
            >
              <source src={slide.video} />
            </video>
          ) : (
            <Image
              src={slide.image}
              alt={t(slide.title)}
              fill
              priority={i === 0}
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="100vw"
              className="object-cover"
            />
          )}

          {/* Overlay ringan untuk keterbacaan (PRD 5.1.1) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-slate-900/20" />

          <div className="container-content relative flex h-full flex-col justify-center">
            <div className="max-w-xl text-white">
              <span className="inline-block rounded-full bg-accent-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                {t(slide.eyebrow)}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight drop-shadow sm:text-5xl lg:text-6xl">
                {t(slide.title)}
              </h1>
              <p className="mt-4 max-w-md text-base text-slate-200 sm:text-lg">
                {t(slide.subtitle)}
              </p>
              <Link
                href={slide.cta.href}
                className="btn-accent mt-7 px-7 py-3.5 text-base shadow-lg"
              >
                {t(slide.cta.label)}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Slide sebelumnya"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40 sm:block"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={next}
        aria-label="Slide berikutnya"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40 sm:block"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ke slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
