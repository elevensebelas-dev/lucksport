// Estimasi ongkos kirim (PRD §9 Fase 3).
// Bila RAJAONGKIR_API_KEY tersedia, dapat dihubungkan ke RajaOngkir.
// Tanpa key, memakai tabel tarif fallback per wilayah agar tetap berfungsi.
import type { ShippingOption } from "./types";

// Tarif dasar per kg (Rp) per zona, plus estimasi hari (etd).
interface Zone {
  province: string;
  base: number; // tarif kurir reguler termurah per kg
  etd: string;
}

// Zona disederhanakan per provinsi (representatif untuk estimasi Fase 3).
export const SHIPPING_ZONES: Zone[] = [
  { province: "DKI Jakarta", base: 12000, etd: "1-2 hari" },
  { province: "Jawa Barat", base: 14000, etd: "1-3 hari" },
  { province: "Banten", base: 14000, etd: "1-3 hari" },
  { province: "Jawa Tengah", base: 16000, etd: "2-3 hari" },
  { province: "DI Yogyakarta", base: 16000, etd: "2-3 hari" },
  { province: "Jawa Timur", base: 18000, etd: "2-4 hari" },
  { province: "Bali", base: 22000, etd: "3-5 hari" },
  { province: "Sumatera", base: 26000, etd: "3-6 hari" },
  { province: "Kalimantan", base: 30000, etd: "4-7 hari" },
  { province: "Sulawesi", base: 32000, etd: "4-7 hari" },
  { province: "Indonesia Timur (NTT/Maluku/Papua)", base: 45000, etd: "5-10 hari" },
];

export const PROVINCES = SHIPPING_ZONES.map((z) => z.province);

// Estimasi berat: asumsi 0,5 kg per item (PRD belum punya field berat).
export function estimateWeightKg(itemCount: number): number {
  return Math.max(1, Math.ceil(itemCount * 0.5));
}

// Kurir + faktor pengali terhadap tarif dasar zona.
const COURIERS: { courier: string; service: string; factor: number; etdAdd: number }[] = [
  { courier: "JNE", service: "REG", factor: 1.0, etdAdd: 0 },
  { courier: "J&T", service: "EZ", factor: 0.95, etdAdd: 0 },
  { courier: "SiCepat", service: "REG", factor: 0.9, etdAdd: 0 },
  { courier: "JNE", service: "YES (Express)", factor: 1.8, etdAdd: -1 },
];

// Estimasi fallback (lokal) — selalu tersedia.
export function estimateFallback(
  province: string,
  weightKg: number
): ShippingOption[] {
  const zone = SHIPPING_ZONES.find((z) => z.province === province);
  if (!zone) return [];
  return COURIERS.map((c) => ({
    courier: c.courier,
    service: c.service,
    cost: Math.round((zone.base * c.factor * weightKg) / 1000) * 1000,
    etd: zone.etd,
  })).sort((a, b) => a.cost - b.cost);
}

// Titik integrasi RajaOngkir (aktif bila key tersedia).
// Dibungkus try/catch agar selalu jatuh ke fallback bila gagal.
export async function estimateShipping(
  province: string,
  weightKg: number
): Promise<{ source: "rajaongkir" | "fallback"; options: ShippingOption[] }> {
  const key = process.env.RAJAONGKIR_API_KEY;
  if (key) {
    try {
      // TODO: panggil RajaOngkir nyata di sini menggunakan kode kota tujuan.
      // Struktur sudah siap; saat key + mapping kota tersedia, ganti baris ini.
      // const res = await fetch("https://api.rajaongkir.com/...", { headers: { key } });
      // ...parse menjadi ShippingOption[]...
      // Untuk saat ini, tetap pakai fallback agar konsisten.
      return { source: "fallback", options: estimateFallback(province, weightKg) };
    } catch {
      return { source: "fallback", options: estimateFallback(province, weightKg) };
    }
  }
  return { source: "fallback", options: estimateFallback(province, weightKg) };
}
