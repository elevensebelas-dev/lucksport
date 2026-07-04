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
          {" "}
        </span>
      ))}
    </>
  );
}

// Label kecil editorial di atas judul section (ritme visual konsisten).
function Eyebrow({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/90 ${
        center ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-8 bg-amber-300/60" />
      {children}
      {center && <span className="h-px w-8 bg-amber-300/60" />}
    </p>
  );
}

// Ikon garis sederhana untuk kartu "Kenapa Luck Sport".
const WHY_ICONS = [
  // Medali (kelas kompetisi)
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="8" r="5.5" /><path d="M8.8 12.8 7 21l5-2.8L17 21l-1.8-8.2" /></svg>,
  // Kunci pas (buatan tangan)
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6 6.4 21l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3.1 3.1-2.6-2.6 3.1-3.1z" /></svg>,
  // Ombak (teruji di danau)
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M2 8c1 .8 1.8 1.2 3 1.2C7.5 9.2 7.5 7 10 7s2.5 2.2 5 2.2S17.5 7 20 7c1.2 0 2 .4 3 1.2" transform="translate(0 -1)" /><path d="M2 14c1 .8 1.8 1.2 3 1.2 2.5 0 2.5-2.2 5-2.2s2.5 2.2 5 2.2 2.5-2.2 5-2.2c1.2 0 2 .4 3 1.2" transform="translate(0 -1)" /><path d="M2 20c1 .8 1.8 1.2 3 1.2 2.5 0 2.5-2.2 5-2.2s2.5 2.2 5 2.2 2.5-2.2 5-2.2c1.2 0 2 .4 3 1.2" transform="translate(0 -1)" /></svg>,
  // Balon chat (konsultasi personal)
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1L3 20l1-5.4A8.5 8.5 0 1 1 21 11.5z" /></svg>,
];

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
      gsap.set(
        [".hero-eyebrow", ".hero-sub", ".hero-cta", ".hero-trust", ".hero-cue"],
        {
          opacity: 0,
          y: 24,
        }
      );
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
        .to(".hero-trust", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
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

      // ── Parallax foto craft & galeri pengalaman ──
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

  const experienceShots = [
    { src: "/gambar-ls/ls-16.jpg", cap: t("award.exp.cap1"), offset: "lg:mt-16" },
    { src: "/gambar-ls/ls-20.jpg", cap: t("award.exp.cap2"), offset: "" },
    { src: "/gambar-ls/ls-19.jpg", cap: t("award.exp.cap3"), offset: "lg:mt-24" },
  ];

  const whyItems = [1, 2, 3, 4].map((n, i) => ({
    icon: WHY_ICONS[i],
    title: t(`award.why.${n}.t`),
    desc: t(`award.why.${n}.d`),
  }));

  const steps = [1, 2, 3].map((n) => ({
    num: String(n).padStart(2, "0"),
    title: t(`award.steps.${n}.t`),
    desc: t(`award.steps.${n}.d`),
  }));

  return (
    <div ref={root} className="relative bg-[#0e3550] text-white">
      {/* Grain sinematik halus di seluruh halaman */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[35] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ════════ HERO — danau Jatiluhur (Three.js) ════════ */}
      <section className="hero-section relative h-[100svh] min-h-[560px] overflow-hidden">
        <LakeScene />
        {/* Vignette bawah: transisi mulus ke section berikutnya */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-gradient-to-b from-transparent to-[#0e3550]" />
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
              className="group rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3.5 text-sm font-bold text-[#1a1230] shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40"
            >
              {t("award.hero.cta")}
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
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
          <p className="hero-trust mt-8 text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
            {t("award.hero.trust")}
          </p>
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

      {/* ════════ PENGALAMAN — galeri foto asli (pemicu emosi) ════════ */}
      <section className="relative overflow-hidden pb-32 pt-4">
        <div className="container-content">
          <div data-reveal>
            <Eyebrow center>{t("award.exp.eyebrow")}</Eyebrow>
          </div>
          <h2
            data-reveal
            className="mx-auto mt-6 max-w-3xl text-center font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {t("award.exp.title")}
          </h2>
          <p
            data-reveal
            className="mx-auto mt-5 max-w-xl text-center text-slate-300/85"
          >
            {t("award.exp.sub")}
          </p>
        </div>
        <div className="container-content mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {experienceShots.map((s, i) => (
            <div
              key={s.src}
              data-reveal
              className={`group relative overflow-hidden rounded-3xl ${s.offset} ${
                i === 2 ? "col-span-2 aspect-[16/10] lg:col-span-1 lg:aspect-[3/4]" : "aspect-[3/4]"
              }`}
            >
              <div data-parallax className="absolute inset-[-12%]">
                <Image
                  src={s.src}
                  alt={s.cap}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1026]/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                {s.cap}
              </span>
            </div>
          ))}
        </div>
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
          <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-amber-300/70">
            01
          </p>
          <h3 className="mt-2 font-display text-3xl text-amber-100 sm:text-4xl">
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
          <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-amber-300/70">
            02
          </p>
          <h3 className="mt-2 font-display text-3xl text-amber-100 sm:text-4xl">
            {t("award.craft2.title")}
          </h3>
          <p className="mt-3 max-w-md text-slate-300/85">{t("award.craft2.desc")}</p>
        </div>
      </section>

      {/* ════════ KOLEKSI — galeri horizontal ════════ */}
      <section ref={horizRef} className="relative bg-[#0c2a40]">
        <div className="flex h-auto flex-col justify-center py-20 lg:h-screen lg:pb-16 lg:pt-28">
          <div className="container-content mb-10 flex items-end justify-between">
            <div>
              <div data-reveal>
                <Eyebrow>{t("award.products.sub")}</Eyebrow>
              </div>
              <h2
                data-reveal
                className="mt-4 font-display text-3xl text-white sm:text-5xl"
              >
                {t("award.products.title")}
              </h2>
            </div>
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
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0c2a40] ring-1 ring-white/5 transition-all duration-500 group-hover:ring-amber-300/40">
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
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-amber-300">
                        {isCallForPrice(p) ? "Call CS" : ""}
                      </p>
                      <span className="translate-y-1 text-sm font-semibold text-amber-200 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {t("award.products.view")} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {/* Kartu penutup → katalog */}
            <Link
              href="/katalog"
              className="flex w-[60vw] flex-shrink-0 snap-start items-center justify-center rounded-2xl border border-white/15 transition-colors hover:border-amber-300/50 hover:bg-white/5 sm:w-[36vw] lg:w-[22vw]"
            >
              <span className="font-display text-2xl text-amber-200">
                {t("award.cta.btn")} →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ KENAPA LUCK SPORT ════════ */}
      <section className="container-content py-24">
        <div data-reveal>
          <Eyebrow>{t("award.why.eyebrow")}</Eyebrow>
        </div>
        <h2
          data-reveal
          className="mt-4 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl"
        >
          {t("award.why.title")}
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((w) => (
            <div
              key={w.title}
              data-reveal
              className="group rounded-2xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur transition-colors duration-300 hover:border-amber-300/40 hover:bg-white/[0.07]"
            >
              <div className="w-fit rounded-xl bg-amber-400/15 p-3 text-amber-300 transition-transform duration-300 group-hover:scale-110">
                {w.icon}
              </div>
              <h3 className="mt-5 font-display text-xl text-white">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300/80">
                {w.desc}
              </p>
            </div>
          ))}
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
      <section className="container-content grid grid-cols-2 gap-10 py-24 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
        {[
          { n: products.length, suffix: "", label: t("award.stats.products") },
          { n: CATEGORIES.length, suffix: "", label: t("award.stats.categories") },
          { n: 100, suffix: "%", label: t("award.stats.handmade") },
          { n: 24, suffix: "/7", label: t("award.stats.assist") },
        ].map((s) => (
          <div key={s.label} data-reveal className="text-center">
            <p className="bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text font-display text-5xl text-transparent sm:text-6xl">
              <span data-count={s.n}>0</span>
              {s.suffix}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/50">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* ════════ MULAI DALAM 3 LANGKAH — jalur pemula ════════ */}
      <section className="container-content relative py-24">
        <div data-reveal>
          <Eyebrow center>{t("award.steps.eyebrow")}</Eyebrow>
        </div>
        <h2
          data-reveal
          className="mx-auto mt-5 max-w-2xl text-center font-display text-4xl text-white sm:text-5xl"
        >
          {t("award.steps.title")}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-md text-center text-slate-300/85">
          {t("award.steps.sub")}
        </p>
        <div className="relative mx-auto mt-14 grid max-w-4xl gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Garis penghubung antar langkah (desktop) */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-8 hidden border-t border-dashed border-white/15 lg:block"
          />
          {steps.map((s) => (
            <div key={s.num} data-reveal className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 font-display text-2xl font-medium text-[#1a1230] shadow-lg shadow-orange-500/25">
                {s.num}
              </div>
              <h3 className="mt-6 font-display text-2xl text-white">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-300/80">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-14 text-center">
          <a
            href={waGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-whatsapp px-9 py-4 text-sm font-bold text-white shadow-lg shadow-whatsapp/30 transition-all hover:scale-105 hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon width={18} height={18} /> {t("award.steps.cta")}
          </a>
        </div>
      </section>

      {/* ════════ CTA SENJA ════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e3550] via-[#3f6da3] to-[#ffd9a0]" />
        {/* Pendar matahari senja */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl"
        />
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
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:scale-105 hover:bg-whatsapp-dark"
            >
              <WhatsAppIcon width={18} height={18} /> {t("award.cta.wa")}
            </a>
            <Link
              href="/katalog"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#1a1230] transition-transform hover:scale-105"
            >
              {t("award.cta.btn")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
