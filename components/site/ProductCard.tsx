import Image from "next/image";
import Link from "next/link";
import { EnquireButton } from "./EnquireButton";
import { firstImage } from "@/lib/utils";

type Product = {
  id: string;
  title: string;
  slug: string;
  images: string;
  category?: { name: string } | null;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={firstImage(product.images)}
          alt={product.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wide text-walnut">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-1 font-serif text-xl text-ink">
          <Link href={`/product/${product.slug}`} className="hover:text-green">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <EnquireButton productId={product.id} productTitle={product.title} full />
          <Link
            href={`/product/${product.slug}`}
            className="text-center text-sm font-medium text-green hover:underline"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}
