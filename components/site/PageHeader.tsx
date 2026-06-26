import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="bg-green-900 text-cream">
      <div className="container-x py-14 lg:py-20">
        {crumbs && (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-cream/60">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-cream">{c.label}</Link>
                ) : (
                  <span className="text-cream/90">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow text-walnut">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-cream/75">{subtitle}</p>}
      </div>
    </section>
  );
}
