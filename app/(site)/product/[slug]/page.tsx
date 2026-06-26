import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { prisma } from "@/lib/db";
import { getProductBySlug } from "@/lib/site";
import { parseImages } from "@/lib/utils";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductCard } from "@/components/site/ProductCard";
import { LeadForm } from "@/components/site/LeadForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p?.title ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const images = parseImages(product.images);
  const related = product.categoryId
    ? await prisma.product.findMany({
        where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
        take: 3,
        include: { category: true },
      })
    : [];

  return (
    <>
      <section className="container-x py-10 lg:py-14">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-green">Home</Link><span>/</span>
          <Link href="/collections" className="hover:text-green">Collections</Link><span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-green">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <ProductGallery images={images} title={product.title} />
            {product.videoUrl && (
              <video
                src={product.videoUrl}
                controls
                className="mt-4 w-full rounded-3xl bg-ink"
              />
            )}
          </div>

          <div className="lg:pl-2">
            {product.category && (
              <p className="eyebrow text-walnut">{product.category.name}</p>
            )}
            <h1 className="mt-2 font-serif text-4xl text-ink">{product.title}</h1>
            <p className="mt-4 leading-relaxed text-muted">
              {product.description ?? "Bespoke, made-to-measure and crafted by FINOKRAFT."}
            </p>

            <ul className="mt-6 grid gap-2.5 text-sm text-ink/80">
              {["Made to measure for your space", "Premium, durable materials", "Free 3D design & site visit", "Professional installation & warranty"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-green" /> {f}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-7 rounded-2xl border border-ink/8 bg-white p-5 shadow-[var(--shadow-card)]">
              <p className="font-serif text-xl text-ink">Enquire about this piece</p>
              <p className="mb-4 mt-1 text-sm text-muted">
                Tell us about your space — we’ll call you back with ideas and a quote.
              </p>
              <LeadForm
                source="product"
                productId={product.id}
                productTitle={product.title}
                variant="full"
                ctaLabel="Request callback"
              />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="font-serif text-2xl text-ink">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
