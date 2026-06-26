import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Cat = {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  children?: { id: string }[];
};

export function CategoryCard({ category }: { category: Cat }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block overflow-hidden rounded-3xl shadow-sm transition hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={category.imageUrl || "/seed/1-living-room.svg"}
          alt={category.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-cream">
        <div>
          <h3 className="font-serif text-2xl">{category.name}</h3>
          {category.children && category.children.length > 0 && (
            <p className="mt-0.5 text-sm text-cream/80">{category.children.length} sub-categories</p>
          )}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream/15 backdrop-blur transition group-hover:bg-walnut">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
