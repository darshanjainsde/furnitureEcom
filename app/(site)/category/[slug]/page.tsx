import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategoryBySlug } from "@/lib/site";
import { PageHeader } from "@/components/site/PageHeader";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";
import { LeadBand } from "@/components/home/LeadBand";
import { Stagger, StaggerItem } from "@/components/site/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  return { title: cat?.name ?? "Collection" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat || !cat.isActive) notFound();

  const hasChildren = cat.children.length > 0;

  // products directly on this category + (for top-level) products across its subcategories
  const childIds = cat.children.map((c) => c.id);
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [{ categoryId: cat.id }, ...(childIds.length ? [{ categoryId: { in: childIds } }] : [])],
    },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        eyebrow={cat.parent ? cat.parent.name : "Collection"}
        title={cat.name}
        subtitle={cat.description ?? undefined}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
          ...(cat.parent ? [{ label: cat.parent.name, href: `/category/${cat.parent.slug}` }] : []),
          { label: cat.name },
        ]}
      />

      {hasChildren && (
        <section className="container-x py-12 lg:py-16">
          <h2 className="font-serif text-2xl text-ink">Browse {cat.name.toLowerCase()}</h2>
          <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cat.children.map((c) => (
              <StaggerItem key={c.id}>
                <CategoryCard category={c} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section className="container-x pb-16 pt-4 lg:pb-20">
        <h2 className="font-serif text-2xl text-ink">
          {hasChildren ? "Featured pieces" : `${cat.name} projects`}
        </h2>
        {products.length === 0 ? (
          <p className="mt-4 text-muted">
            New pieces are being added here. Use the enquiry button to ask about {cat.name.toLowerCase()}.
          </p>
        ) : (
          <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      <LeadBand />
    </>
  );
}
