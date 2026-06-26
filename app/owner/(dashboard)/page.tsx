import Link from "next/link";
import { FolderTree, Sparkles, Inbox, Package, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function OwnerDashboard() {
  const [categories, services, leads, products, why, socials] = await Promise.all([
    prisma.category.count(),
    prisma.service.count(),
    prisma.lead.count(),
    prisma.product.count(),
    prisma.whyChooseUs.count(),
    prisma.socialLink.count(),
  ]);

  const stats = [
    { label: "Categories", value: categories, href: "/owner/categories", icon: FolderTree },
    { label: "Services", value: services, href: "/owner/services", icon: Sparkles },
    { label: "Products", value: products, href: "/business/products", icon: Package },
    { label: "Leads", value: leads, href: "/owner/leads", icon: Inbox },
  ];

  const quick = [
    { label: "Edit branding & homepage content", href: "/owner/branding" },
    { label: "Manage categories & subcategories", href: "/owner/categories" },
    { label: `Why-choose-us points (${why})`, href: "/owner/why" },
    { label: `Social media links (${socials})`, href: "/owner/social" },
  ];

  return (
    <>
      <AdminHeader title="Welcome back" description="Control everything visitors see on your website." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <s.icon className="h-6 w-6 text-walnut" strokeWidth={1.6} />
              <p className="mt-4 font-serif text-4xl text-ink">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-serif text-xl text-ink">Quick actions</h2>
          <ul className="mt-4 space-y-2">
            {quick.map((q) => (
              <li key={q.href}>
                <Link
                  href={q.href}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink/80 hover:bg-green/6 hover:text-green"
                >
                  {q.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-serif text-xl text-ink">About these portals</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            This <strong>Owner portal</strong> controls site structure, branding and content. Your
            day-to-day team uses the <strong>Business portal</strong> (separate login) to manage
            leads, contact numbers and products. You can do everything they can, too.
          </p>
          <Link
            href="/business"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green hover:underline"
          >
            Open Business portal <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    </>
  );
}
