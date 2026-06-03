import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-content flex flex-col items-center justify-center py-28 text-center">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-slate-600">
        Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk kembali
        belanja gear olahraga terbaik.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-outline">
          Ke Beranda
        </Link>
        <Link href="/katalog" className="btn-primary">
          Lihat Katalog
        </Link>
      </div>
    </div>
  );
}
