import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";

type Product = {
  id: string;
  title: string;
  slug: string;
  images: string;
  category?: { name: string } | null;
};

export function WorksGallery({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section id="works" className="container-x py-16 lg:py-24">
      <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-walnut">Our work</p>
          <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Recently crafted</h2>
        </div>
        <Link href="/works" className="text-sm font-medium text-green hover:underline">
          View all work →
        </Link>
      </Reveal>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
