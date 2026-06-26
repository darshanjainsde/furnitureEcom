import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { getSiteConfig, getSocials, getContacts, getTopCategories } from "@/lib/site";
import { SocialIcon } from "@/lib/icons";

export async function SiteFooter() {
  const [cfg, socials, contacts, cats] = await Promise.all([
    getSiteConfig(),
    getSocials(),
    getContacts(),
    getTopCategories(),
  ]);
  const primary = contacts.find((c) => c.isPrimary) ?? contacts[0];

  return (
    <footer className="mt-24 bg-green-900 text-cream/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <p className="font-serif text-3xl text-cream">{cfg.brandName}</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">{cfg.footerTagline}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-walnut"
                >
                  <SocialIcon platform={s.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow text-walnut">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/collections" className="hover:text-cream">Collections</Link></li>
            <li><Link href="/works" className="hover:text-cream">Our Work</Link></li>
            <li><Link href="/about" className="hover:text-cream">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-cream">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-walnut">Collections</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {cats.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-cream">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-walnut">Get in touch</p>
          <ul className="mt-4 space-y-3 text-sm">
            {primary?.address && (
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-walnut" />
                <span>{primary.address}</span>
              </li>
            )}
            {primary?.phone && (
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-walnut" />
                <a href={`tel:${primary.phone.replace(/\s/g, "")}`} className="hover:text-cream">{primary.phone}</a>
              </li>
            )}
            {primary?.email && (
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-walnut" />
                <a href={`mailto:${primary.email}`} className="hover:text-cream">{primary.email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {cfg.brandName}. All rights reserved.</p>
          <p>{cfg.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
