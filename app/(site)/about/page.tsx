import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { LeadBand } from "@/components/home/LeadBand";
import { Reveal } from "@/components/site/Reveal";
import { getSiteConfig, getWhyChooseUs } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

const STATS = [
  { value: "10+", label: "Years of craft" },
  { value: "500+", label: "Spaces delivered" },
  { value: "100%", label: "In-house manufacturing" },
  { value: "4.8★", label: "Average client rating" },
];

export default async function AboutPage() {
  const [cfg, why] = await Promise.all([getSiteConfig(), getWhyChooseUs()]);
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={cfg.aboutTitle}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="container-x py-14 lg:py-20">
        <Reveal className="mx-auto max-w-3xl">
          <p className="whitespace-pre-line text-lg leading-relaxed text-ink/85">
            {cfg.aboutBody || "FINOKRAFT designs and crafts modular furniture and full-home interiors."}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink/8 bg-white p-6 text-center">
              <p className="font-serif text-4xl text-green">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <WhyChooseUs items={why} />
      <LeadBand />
    </>
  );
}
