import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteConfig, getPrimaryContact, getTopCategories } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [cfg, primary, cats] = await Promise.all([
    getSiteConfig(),
    getPrimaryContact(),
    getTopCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        logoUrl={cfg.logoUrl}
        brandName={cfg.brandName}
        phone={primary?.phone}
        whatsapp={primary?.whatsapp ?? primary?.phone}
        categories={cats.map((c) => ({ name: c.name, slug: c.slug }))}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton whatsapp={primary?.whatsapp ?? primary?.phone} />
    </div>
  );
}
