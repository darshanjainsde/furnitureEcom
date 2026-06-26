import Link from "next/link";
import { Inbox, Package, Phone, ArrowRight, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BusinessDashboard() {
  const [total, fresh, products, contacts, recent] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.product.count(),
    prisma.contactDetail.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { product: { select: { title: true } } } }),
  ]);

  const stats = [
    { label: "New leads", value: fresh, href: "/business/leads?status=NEW", icon: Inbox },
    { label: "Total leads", value: total, href: "/business/leads", icon: Inbox },
    { label: "Products", value: products, href: "/business/products", icon: Package },
    { label: "Contact numbers", value: contacts, href: "/business/contacts", icon: Phone },
  ];

  return (
    <>
      <AdminHeader
        title="Business dashboard"
        description="Track leads and manage your catalogue."
        action={
          <Link href="/business/products" className="inline-flex h-10 items-center gap-2 rounded-full bg-green px-5 text-sm font-medium text-cream hover:bg-green-700">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        }
      />

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

      <Card className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">Recent leads</h2>
          <Link href="/business/leads" className="inline-flex items-center gap-1 text-sm font-medium text-green hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">No leads yet. They’ll appear here as visitors enquire.</p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {recent.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-ink">{l.name}</p>
                  <p className="text-xs text-muted">{l.phone} · {formatDate(l.createdAt)}</p>
                </div>
                <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-medium text-ink/70">{l.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
