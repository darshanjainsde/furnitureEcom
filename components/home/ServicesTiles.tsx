import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { Icon } from "@/lib/icons";

type Service = { id: string; title: string; slug: string; icon: string; blurb: string };

export function ServicesTiles({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <section id="services" className="bg-green-900 py-16 text-cream lg:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-walnut">What we offer</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Services &amp; solutions</h2>
          </div>
          <p className="max-w-md text-sm text-cream/70">
            From a single wardrobe to a complete home — explore the modular solutions we design,
            craft and install.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <StaggerItem key={s.id}>
              <Link
                href="/collections"
                className="group flex h-full flex-col rounded-2xl border border-cream/12 bg-cream/5 p-6 transition hover:border-walnut hover:bg-cream/10"
              >
                <div className="flex items-center justify-between">
                  <Icon name={s.icon} className="h-8 w-8 text-walnut" />
                  <ArrowUpRight className="h-5 w-5 text-cream/40 transition group-hover:text-cream" />
                </div>
                <h3 className="mt-5 font-serif text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{s.blurb}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
