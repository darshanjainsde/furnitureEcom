import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { Icon } from "@/lib/icons";

type Item = { id: string; icon: string; title: string; text: string };

export function WhyChooseUs({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <section id="why" className="container-x py-16 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-walnut">Why FINOKRAFT</p>
        <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Design you’ll love, built to last
        </h2>
        <p className="mt-4 text-muted">
          We obsess over the details others skip — so your space looks beautiful and works
          flawlessly for years.
        </p>
      </Reveal>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <StaggerItem key={it.id}>
            <div className="group h-full rounded-2xl border border-ink/8 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green/8 text-green transition group-hover:bg-green group-hover:text-cream">
                <Icon name={it.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
