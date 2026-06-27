import Image from "next/image";
import { BadgeCheck, Boxes, Clock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/site/LeadForm";

export function Hero({
  headline,
  subtext,
  images = [],
}: {
  headline: string;
  subtext: string;
  images?: string[];
}) {
  const pics = [
    images[0] ?? "/seed/3-kitchen-dining.svg",
    images[1] ?? "/seed/4-modular-wardrobe.svg",
    images[2] ?? "/seed/1-living-room.svg",
  ];
  return (
    <section className="bg-paper">
      <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Reveal>
            <p className="eyebrow text-walnut">Modular Furniture &amp; Full-Home Interiors</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">
              {headline}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
              {subtext}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-7 rounded-2xl border border-ink/8 bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
              <p className="mb-3 text-sm font-medium text-ink">
                Book a <span className="text-green">free design consultation</span>
              </p>
              <LeadForm source="home" variant="compact" ctaLabel="Get a callback" />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
              <li className="flex items-center gap-2"><Boxes className="h-4 w-4 text-green" /> Free 3D design</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-green" /> On-time install</li>
              <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-green" /> Warranty backed</li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={32}>
          <div className="relative mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
              <Image src={pics[0]} alt="Featured work" fill className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
              <Image src={pics[1]} alt="Featured work" fill className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
              <Image src={pics[2]} alt="Featured work" fill className="object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
