import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { LeadBand } from "@/components/home/LeadBand";
import { Stagger, StaggerItem } from "@/components/site/Reveal";
import { getAllActiveProducts } from "@/lib/site";

export const metadata: Metadata = { title: "Our Work" };

export default async function WorksPage() {
  const products = await getAllActiveProducts();
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Our work"
        subtitle="A selection of modular kitchens, wardrobes and interiors we’ve designed and installed."
        crumbs={[{ label: "Home", href: "/" }, { label: "Our Work" }]}
      />
      <section className="container-x py-14 lg:py-20">
        {products.length === 0 ? (
          <p className="text-muted">Projects will appear here soon.</p>
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
