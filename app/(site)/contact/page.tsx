import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { LeadForm } from "@/components/site/LeadForm";
import { SocialIcon } from "@/lib/icons";
import { getContacts, getSocials } from "@/lib/site";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [contacts, socials] = await Promise.all([getContacts(), getSocials()]);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s plan your space"
        subtitle="Tell us a little about your project and our design team will get back to you with ideas, a 3D plan and a transparent quote."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="container-x grid gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <h2 className="font-serif text-3xl text-ink">Talk to us</h2>
          <p className="mt-2 text-muted">We’re happy to answer questions and book a free consultation.</p>

          <div className="mt-8 space-y-6">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-2xl border border-ink/8 bg-white p-5">
                <p className="text-sm font-semibold text-ink">{c.label}</p>
                <div className="mt-3 space-y-2 text-sm text-ink/80">
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-green">
                      <Phone className="h-4 w-4 text-green" /> {c.phone}
                    </a>
                  )}
                  {c.whatsapp && (
                    <a href={waLink(c.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-green">
                      <MessageCircle className="h-4 w-4 text-green" /> WhatsApp: {c.whatsapp}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-3 hover:text-green">
                      <Mail className="h-4 w-4 text-green" /> {c.email}
                    </a>
                  )}
                  {c.address && (
                    <p className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" /> {c.address}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">Follow us:</span>
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-green/8 text-green transition hover:bg-green hover:text-cream"
                  >
                    <SocialIcon platform={s.platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-[var(--shadow-card)] lg:p-8">
          <h2 className="font-serif text-2xl text-ink">Request a free consultation</h2>
          <p className="mb-5 mt-1 text-sm text-muted">No obligation — just good design advice.</p>
          <LeadForm source="contact" variant="full" ctaLabel="Send enquiry" />
        </div>
      </section>
    </>
  );
}
