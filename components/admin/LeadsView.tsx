import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/db";
import { LeadCard } from "@/components/admin/LeadCard";
import { cn } from "@/lib/utils";

const STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;

export async function LeadsView({ status, basePath }: { status?: string; basePath: string }) {
  const active = STATUSES.includes(status as (typeof STATUSES)[number]) ? status : "ALL";

  const [leads, total, counts] = await Promise.all([
    prisma.lead.findMany({
      where: active === "ALL" ? {} : { status: active },
      orderBy: { createdAt: "desc" },
      include: { product: { select: { title: true } } },
    }),
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const tabs = [
    { key: "ALL", label: "All", n: total },
    { key: "NEW", label: "New", n: countFor("NEW") },
    { key: "CONTACTED", label: "Contacted", n: countFor("CONTACTED") },
    { key: "CLOSED", label: "Closed", n: countFor("CLOSED") },
  ];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.key === "ALL" ? basePath : `${basePath}?status=${t.key}`}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                active === t.key ? "bg-green text-cream" : "bg-white text-ink/70 hover:bg-green/8",
              )}
            >
              {t.label} <span className="opacity-70">({t.n})</span>
            </Link>
          ))}
        </div>
        <a
          href="/api/leads/export"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-green/30 px-4 text-sm font-medium text-green hover:bg-green/8"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center text-muted">
          No leads {active !== "ALL" ? `with status “${active}”` : "yet"}.
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <LeadCard key={l.id} lead={l} />
          ))}
        </div>
      )}
    </>
  );
}
