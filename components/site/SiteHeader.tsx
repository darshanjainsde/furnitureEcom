"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn, waLink } from "@/lib/utils";

type NavCategory = { name: string; slug: string };

export function SiteHeader({
  logoUrl,
  brandName,
  phone,
  whatsapp,
  categories,
}: {
  logoUrl: string;
  brandName: string;
  phone?: string | null;
  whatsapp?: string | null;
  categories: NavCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [collOpen, setCollOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/collections", label: "Collections" },
    { href: "/works", label: "Our Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur transition-all",
        scrolled ? "border-ink/10 shadow-[0_4px_20px_-12px_rgba(43,42,38,0.3)]" : "border-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex shrink-0 items-center" aria-label={brandName}>
          <Image
            src={logoUrl}
            alt={brandName}
            width={180}
            height={90}
            priority
            className="h-9 w-auto object-contain lg:h-11"
          />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setCollOpen(true)}
            onMouseLeave={() => setCollOpen(false)}
          >
            <Link
              href="/collections"
              className="flex items-center gap-1 text-sm font-medium text-ink/80 hover:text-green"
            >
              Collections <ChevronDown className="h-4 w-4" />
            </Link>
            {collOpen && categories.length > 0 && (
              <div className="absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3">
                <ul className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-xl">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/category/${c.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm text-ink/80 hover:bg-green/8 hover:text-green"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {links.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink/80 hover:text-green">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 rounded-full border border-green/25 px-4 py-2 text-sm font-medium text-green hover:bg-green/8 md:inline-flex"
            >
              <Phone className="h-4 w-4" /> {phone}
            </a>
          )}
          <a
            href={whatsapp ? waLink(whatsapp, "Hi FINOKRAFT, I'd like a free design consultation.") : "/contact"}
            target={whatsapp ? "_blank" : undefined}
            rel="noreferrer"
            className="hidden rounded-full bg-green px-5 py-2.5 text-sm font-medium text-cream hover:bg-green-700 sm:inline-flex"
          >
            Free Consultation
          </a>
          <button
            className="rounded-full p-2 text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-ink/10 bg-white lg:hidden">
          <nav className="container-x flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/5 py-3 text-[15px] font-medium text-ink/85"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={whatsapp ? waLink(whatsapp) : "/contact"}
              className="mt-3 rounded-full bg-green py-3 text-center text-sm font-medium text-cream"
            >
              Free Consultation
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
