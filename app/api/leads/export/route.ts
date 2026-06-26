import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { title: true } } },
  });

  const header = ["Name", "Phone", "Email", "Source", "Product", "Status", "Notes", "Message", "Created"];
  const rows = leads.map((l) =>
    [
      l.name,
      l.phone,
      l.email ?? "",
      l.source,
      l.product?.title ?? "",
      l.status,
      l.notes ?? "",
      l.message ?? "",
      l.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="finokraft-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
