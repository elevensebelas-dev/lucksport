import type { Metadata } from "next";
import KebijakanClient from "@/components/KebijakanClient";

export const metadata: Metadata = {
  title: "Syarat & Kebijakan / Terms & Policies",
  description:
    "Syarat & ketentuan pembelian serta kebijakan privasi Luck Sport. Terms & conditions and privacy policy.",
};

export default function KebijakanPage() {
  return <KebijakanClient />;
}
