"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { STORE } from "@/lib/config";
import { formatIDR, isCallForPriceCategory } from "@/lib/products";
import { waGeneral } from "@/lib/whatsapp";
import { botReply, GREETING } from "@/lib/chatbot";
import {
  ChatIcon,
  SendIcon,
  CloseIcon,
  WhatsAppIcon,
} from "./Icons";

interface ProductHit {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
}
interface Msg {
  id: number;
  from: "bot" | "user";
  text?: string;
  products?: ProductHit[];
  wa?: boolean;
}

let _id = 0;
const nextId = () => ++_id;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Buka dari tombol lain (mis. "Chat CS" di header) via event global.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("lucksport:open-chat", handler);
    return () => window.removeEventListener("lucksport:open-chat", handler);
  }, []);

  // Sapaan otomatis saat pertama dibuka.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: nextId(), from: "bot", text: GREETING.text }]);
      setChips(GREETING.chips ?? []);
    }
  }, [open, messages.length]);

  // Auto-scroll ke bawah.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function pushBot(m: Omit<Msg, "id" | "from">) {
    setMessages((prev) => [...prev, { id: nextId(), from: "bot", ...m }]);
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);
    setInput("");
    setChips([]);
    setTyping(true);

    const reply = botReply(text);

    // Jeda kecil agar terasa natural (tetap instan).
    await new Promise((r) => setTimeout(r, 350));
    setTyping(false);
    pushBot({ text: reply.text, wa: reply.wa });
    if (reply.chips) setChips(reply.chips);

    if (reply.search) {
      setTyping(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(reply.search)}`);
        const data = await res.json();
        await new Promise((r) => setTimeout(r, 250));
        if (Array.isArray(data.results) && data.results.length > 0) {
          pushBot({ text: "Ini yang saya temukan: 👇", products: data.results });
          setChips(["Cara pesan", "Hubungi CS"]);
        } else {
          pushBot({
            text:
              "Hmm, saya belum menemukan produk itu. Mau lihat katalog lengkap atau terhubung ke CS?",
            wa: true,
          });
          setChips(["Lihat produk", "Hubungi CS"]);
        }
      } catch {
        pushBot({ text: "Maaf, pencarian sedang bermasalah. Coba hubungi CS ya 🙏", wa: true });
      } finally {
        setTyping(false);
      }
    }
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka chat asisten Luck Sport"
          className="group fixed bottom-5 right-4 z-30 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105 hover:bg-brand-700 sm:bottom-6 sm:right-6"
        >
          <span className="relative flex">
            <ChatIcon width={24} height={24} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-green-400 ring-2 ring-white" />
          </span>
          <span className="text-sm font-semibold">Chat • Balas Instan</span>
        </button>
      )}

      {/* Panel chat */}
      {open && (
        <div className="fixed bottom-0 right-0 z-40 flex h-[80vh] max-h-[600px] w-full flex-col overflow-hidden bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-2xl sm:border sm:border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <ChatIcon width={20} height={20} />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">Asisten Luck Sport</p>
                <p className="flex items-center gap-1 text-xs text-brand-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online · balas instan
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup chat" className="text-white/80 hover:text-white">
              <CloseIcon />
            </button>
          </div>

          {/* Pesan */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.from === "user"
                      ? "rounded-br-sm bg-brand-600 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {m.text && <p className="whitespace-pre-line leading-relaxed">{m.text}</p>}

                  {/* Hasil produk */}
                  {m.products && (
                    <div className="mt-2 space-y-2">
                      {m.products.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/produk/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2 hover:border-brand-400"
                        >
                          <span className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                            <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-slate-800">
                              {p.name}
                            </span>
                            <span className="text-xs font-medium text-brand-700">
                              {isCallForPriceCategory(p.category) ? "Call CS" : formatIDR(p.price)}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tombol eskalasi WhatsApp */}
                  {m.wa && (
                    <a
                      href={waGeneral()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-3 py-2 text-xs font-semibold text-white hover:bg-whatsapp-dark"
                    >
                      <WhatsAppIcon width={16} height={16} /> Hubungi CS via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Indikator mengetik */}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 py-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan…"
              className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              aria-label="Pesan"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Kirim"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
            >
              <SendIcon width={18} height={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
