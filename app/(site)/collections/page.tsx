import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { CategoryCard } from "@/components/site/CategoryCard";
import { LeadBand } from "@/components/home/LeadBand";
import { Stagger, StaggerItem } from "@/components/site/Reveal";
import { getTopCategories } from "@/lib/site";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const cats = await getTopCategories();
  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Our collections"
        subtitle="Explore modular furniture and interior solutions across every room of your home."
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />
      <section className="container-x py-14 lg:py-20">
        {cats.length === 0 ? (
          <p className="text-muted">Collections will appear here soon.</p>
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c) => (
              <StaggerItem key={c.id}>
                <CategoryCard category={c} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
      <LeadBand />
    </>
  );
}
