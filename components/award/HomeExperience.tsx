"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LanguageContext";
import { waGeneral } from "@/lib/whatsapp";
import { CATEGORIES, categoryLabel, isCallForPrice } from "@/lib/products";
import { blurDataURL } from "@/lib/image";
import type { Product } from "@/lib/types";
import { WhatsAppIcon } from "@/components/Icons";

const LakeScene = dynamic(() => import("./LakeScene"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Pisahkan kalimat menjadi <span> per kata untuk animasi GSAP.
function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className={`inline-block ${className}`}>
          {w}
          {" "}
        </span>
      ))}
    </>
  );
}

export default function HomeExperience({ products }: { products: Product[] }) {
  const { t, lang } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const horizRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // ── Intro hero ──
      gsap.set(".hero-word", { yPercent: 120, rotate: 4 });
      gsap.set([".hero-eyebrow", ".hero-sub", ".hero-cta", ".hero-cue"], {
        opacity: 0,
        y: 24,
      });
      gsap
        .timeline({ delay: 0.25, defaults: { ease: "power4.out" } })
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.8 })
        .to(
          ".hero-word",
          { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.08 },
          "-=0.5"
        )
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(".hero-cue", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

      gsap.to(".hero-cue-dot", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: "sine.inOut",
      });

      // Hero memudar saat di-scroll (parallax keluar)
      gsap.to(".hero-overlay", {
        opacity: 0,
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "70% top",
          scrub: true,
        },
      });

      // ── Manifesto: kata demi kata menyala ──
      gsap.fromTo(
        ".manifesto-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ".manifesto-section",
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );

      // ── Reveal umum ──
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // ── Parallax foto craft ──
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // ── Galeri horizontal ter-pin (desktop) ──
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const horiz = horizRef.current;
        if (!track || !horiz) return;
        const getDist = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -getDist(),
          ease: "none",
          scrollTrigger: {
            trigger: horiz,
            start: "top top",
            end: () => "+=" + getDist(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // ── Penghitung statistik ──
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count || "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });

      // ── Marquee tak berujung ──
      gsap.to(".marquee-track", {
        xPercent: -50,
        repeat: -1,
        duration: 22,
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, [lang]);

  const marqueeWords = [
    "KAYAK",
    "CANOE",
    "LAKE",
    "SUNSET",
    "PADDLE",
    "RACE",
    "LUCK SPORT",
  ];

  return (
    <div ref={root} className="bg-[#0e3550] text-white">
      {/* ════════ HERO — pagi di Danau Jatiluhur (Three.js) ════════ */}
      <section className="hero-section relative h-[100svh] min-h-[560px] overflow-hidden">
        <LakeScene />
        <div className="hero-overlay container-content relative z-10 flex h-full flex-col items-center justify-center text-center">
          <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/90 sm:text-sm">
            {t("award.hero.eyebrow")}
          </p>
          <h1 className="mt-6 font-display text-[13vw] font-medium leading-[0.95] sm:text-7xl lg:text-8xl">
            <span className="block overflow-hidden">
              <span className="hero-word inline-block bg-gradient-to-r from-amber-100 via-yellow-200 to-sky-300 bg-clip-text text-transparent">
                {t("award.hero.title1")}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word inline-block bg-gradient-to-r from-amber-100 via-yellow-200 to-sky-300 bg-clip-text italic text-transparent">
                {t("award.hero.title2")}
              </span>
            </span>
          </h1>
          <p className="hero-sub mt-7 max-w-md text-base text-slate-200/90 sm:text-lg">
            {t("award.hero.sub")}
          </p>
          <div className="hero-cta mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/katalog"
              className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3.5 text-sm font-bold text-[#1a1230] shadow-lg shadow-orange-500/30 transition-transform hover:scale-105"
            >
              {t("award.hero.cta")}
            </Link>
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10"
            >
              {t("award.hero.cta2")}
            </a>
          </div>
        </div>
        <div className="hero-cue absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
            {t("award.scroll")}
          </span>
          <div className="mx-auto mt-2 h-9 w-5 rounded-full border border-white/30">
            <div className="hero-cue-dot mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-300" />
          </div>
        </div>
      </section>

      {/* ════════ MANIFESTO ════════ */}
      <section className="manifesto-section relative px-6 py-28 sm:py-40">
        <p className="mx-auto max-w-4xl text-center font-display text-3xl font-light leading-snug text-slate-100 sm:text-5xl sm:leading-snug">
          <Words text={t("award.manifesto")} className="manifesto-word" />
        </p>
      </section>

      {/* ════════ CRAFT — parallax foto asli ════════ */}
      <section className="container-content grid gap-16 pb-28 lg:grid-cols-2 lg:gap-10">
        <div data-reveal className="lg:mt-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <div data-parallax className="absolute inset-[-12%]">
              <Image
                src="/gambar-ls/ls-05.jpg"
                alt="Kayak Luck Sport"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-cover"
              />
            </div>
          </div>
          <h3 className="mt-8 font-display text-3xl text-amber-100 sm:text-4xl">
            {t("award.craft1.title")}
          </h3>
          <p className="mt-3 max-w-md text-slate-300/85">{t("award.craft1.desc")}</p>
        </div>
        <div data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <div data-parallax className="absolute inset-[-12%]">
              <Image
                src="/gambar-ls/ls-22.jpg"
                alt="Pendayung di Danau Jatiluhur saat pagi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-cover"
              />
            </div>
          </div>
          <h3 className="mt-8 font-display text-3xl text-amber-100 sm:text-4xl">
            {t("award.craft2.title")}
          </h3>
          <p className="mt-3 max-w-md text-slate-300/85">{t("award.craft2.desc")}</p>
        </div>
      </section>

      {/* ════════ KOLEKSI — galeri horizontal ════════ */}
      <section ref={horizRef} className="relative bg-[#0c2a40]">
        <div className="flex h-auto flex-col justify-center py-20 lg:h-screen lg:pb-16 lg:pt-28">
          <div className="container-content mb-10 flex items-end justify-between">
            <h2 data-reveal className="font-display text-3xl text-white sm:text-5xl">
              {t("award.products.title")}
            </h2>
            <p className="hidden text-sm uppercase tracking-[0.25em] text-white/40 lg:block">
              {t("award.products.sub")} →
            </p>
          </div>
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x gap-6 overflow-x-auto px-6 lg:gap-8 lg:overflow-visible lg:px-[8vw]"
          >
            {products.map((p, i) => (
              <Link
                key={p.product_id}
                href={`/produk/${p.slug}`}
                className="group w-[76vw] flex-shrink-0 snap-start sm:w-[46vw] lg:w-[30vw]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0c2a40]">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 76vw, 30vw"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1026]/90 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur">
                    {categoryLabel(p.category, lang)}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-xs text-white/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 font-display text-xl leading-tight text-white sm:text-2xl">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-amber-300">
                      {isCallForPrice(p) ? "Call CS" : ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {/* Kartu penutup → katalog */}
            <Link
              href="/katalog"
              className="flex w-[60vw] flex-shrink-0 snap-start items-center justify-center rounded-2xl border border-white/15 sm:w-[36vw] lg:w-[22vw]"
            >
              <span className="font-display text-2xl text-amber-200">
                {t("award.cta.btn")} →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ KATEGORI ════════ */}
      <section className="container-content py-24">
        <h2 data-reveal className="font-display text-4xl text-white sm:text-5xl">
          {t("award.categories.title")}
        </h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/katalog?kategori=${c.slug}`}
              data-reveal
              className="group relative flex items-center justify-between gap-6 py-7"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-display text-3xl text-white transition-colors group-hover:text-amber-300 sm:text-5xl">
                  {categoryLabel(c.name, lang)}
                </span>
                <span className="hidden text-sm text-white/40 sm:inline">
                  {lang === "en" ? c.descEn : c.descId}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative hidden h-16 w-24 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
                  <Image src={c.image} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <span className="text-2xl text-amber-300 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════ MARQUEE ════════ */}
      <div className="overflow-hidden border-y border-white/10 py-5">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span
              key={i}
              className="font-display text-2xl tracking-wide text-white/25"
            >
              {w} <span className="text-amber-400/60">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════ STATISTIK ════════ */}
      <section className="container-content grid grid-cols-2 gap-10 py-24 lg:grid-cols-4">
        {[
          { n: products.length, suffix: "", label: t("award.stats.products") },
          { n: CATEGORIES.length, suffix: "", label: t("award.stats.categories") },
          { n: 100, suffix: "%", label: t("award.stats.handmade") },
          { n: 24, suffix: "/7", label: t("award.stats.assist") },
        ].map((s) => (
          <div key={s.label} data-reveal className="text-center">
            <p className="font-display text-5xl text-amber-200 sm:text-6xl">
              <span data-count={s.n}>0</span>
              {s.suffix}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/50">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* ════════ CTA SENJA ════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e3550] via-[#3f6da3] to-[#ffd9a0]" />
        <div className="container-content relative py-32 text-center">
          <h2
            data-reveal
            className="mx-auto max-w-3xl font-display text-5xl leading-tight text-white sm:text-7xl"
          >
            {t("award.cta.title")}
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-md text-white/85">
            {t("award.cta.sub")}
          </p>
          <div
            data-reveal
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/katalog"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1a1230] transition-transform hover:scale-105"
            >
              {t("award.cta.btn")}
            </Link>
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon width={18} height={18} /> {t("award.cta.wa")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
