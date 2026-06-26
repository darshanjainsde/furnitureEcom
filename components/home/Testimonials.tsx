import { Quote } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";

type Item = { id: string; name: string; role: string | null; quote: string };

export function Testimonials({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-cream-200 py-16 lg:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-walnut">Loved by homeowners</p>
          <h2 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">What our clients say</h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <StaggerItem key={t.id}>
              <figure className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-7">
                <Quote className="h-8 w-8 text-walnut/40" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-ink/8 pt-4">
                  <p className="font-medium text-ink">{t.name}</p>
                  {t.role && <p className="text-sm text-muted">{t.role}</p>}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
