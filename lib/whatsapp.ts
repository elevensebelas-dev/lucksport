import { STORE } from "./config";
import { formatIDR } from "./products";
import type { CartItem } from "./types";

// Bangun link wa.me dengan pesan ter-encode.
export function waLink(message: string): string {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

// Pesan umum dari floating button (PRD 5.1.4 / 5.5)
export function waGeneral(): string {
  return waLink("Halo Lucksport, saya ingin bertanya tentang produk...");
}

// "Beli Langsung via WhatsApp" dari halaman detail produk (PRD 5.3.3)
export function waBuyProduct(
  name: string,
  size: string,
  color: string
): string {
  return waLink(
    `Halo, saya ingin memesan ${name} ukuran ${size}, warna ${color}. Apakah tersedia?`
  );
}

// Notifikasi stok kembali untuk produk habis (PRD 5.5)
export function waNotifyStock(name: string): string {
  return waLink(`Tolong kabari saya jika ${name} tersedia kembali`);
}

export interface CheckoutShipping {
  province: string;
  courier: string;
  service: string;
  cost: number;
}

// Checkout: ringkasan keranjang lengkap auto-generated (PRD 5.4.3)
export function waCheckout(
  items: CartItem[],
  note?: string,
  shipping?: CheckoutShipping | null
): string {
  const lines: string[] = [];
  lines.push(`Halo ${STORE.name}, saya ingin memesan:`);
  lines.push("");

  let total = 0;
  items.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    lines.push(
      `${idx + 1}. ${item.name}` +
        `\n   - Ukuran: ${item.size} | Warna: ${item.color}` +
        `\n   - Jumlah: ${item.quantity} x ${formatIDR(item.price)}` +
        `\n   - Subtotal: ${formatIDR(subtotal)}`
    );
  });

  lines.push("");
  lines.push(`Subtotal: ${formatIDR(total)}`);

  if (shipping) {
    lines.push(
      `Ongkir (${shipping.province} · ${shipping.courier} ${shipping.service}): ${formatIDR(
        shipping.cost
      )}`
    );
    lines.push(`*Total: ${formatIDR(total + shipping.cost)}*`);
  } else {
    lines.push(`*Total: ${formatIDR(total)}* (belum termasuk ongkir)`);
  }

  if (note && note.trim()) {
    lines.push("");
    lines.push(`Catatan: ${note.trim()}`);
  }

  lines.push("");
  lines.push("Mohon konfirmasi ketersediaan stok dan instruksi pembayaran. Terima kasih!");

  return waLink(lines.join("\n"));
}
