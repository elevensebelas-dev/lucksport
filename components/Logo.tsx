import Image from "next/image";
import Link from "next/link";

// Logo resmi Luck Sport (public/brand/logo.png). Sudah memuat wordmark
// "LUCK SPORT", jadi tidak perlu teks tambahan.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Luck Sport beranda"
    >
      <Image
        src="/brand/logo.png"
        alt="Luck Sport"
        width={535}
        height={324}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
}
