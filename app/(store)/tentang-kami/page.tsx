import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "Tentang Kami / About Us",
  description:
    "Kenali Luck Sport Indonesia — produsen perlengkapan olahraga air (kayak, kano, perahu, SUP). Get to know Luck Sport Indonesia, a water-sports equipment maker.",
};

export default function TentangKamiPage() {
  return <AboutClient />;
}
