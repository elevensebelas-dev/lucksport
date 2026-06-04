import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import { blurDataURL } from "@/lib/image";

// Grid kategori unggulan dengan hover zoom + overlay (PRD 5.1.2)
export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/katalog?kategori=${cat.slug}`}
          className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-200"
        >
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity group-hover:from-brand-900/80" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="text-lg font-bold">{cat.name}</h3>
            <p className="text-sm text-slate-200">{cat.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
