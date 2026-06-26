import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/site/LeadForm";

export function LeadBand() {
  return (
    <section id="contact-cta" className="bg-green py-16 text-cream lg:py-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-cream/70">Free consultation</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
            Let’s design your space together
          </h2>
          <p className="mt-4 max-w-md text-cream/80">
            Share your details and our design team will reach out with ideas, a 3D plan and a
            transparent quote — no obligation.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-2xl bg-green-900/40 p-6 ring-1 ring-cream/15">
            <LeadForm source="home" variant="full" tone="dark" ctaLabel="Request my free consultation" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
