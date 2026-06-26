import { redirect } from "next/navigation";
import { AdminShell, type NavItem } from "@/components/admin/AdminShell";
import { getSessionForRole } from "@/lib/auth";
import { getSiteConfig } from "@/lib/site";

const NAV: NavItem[] = [
  { href: "/owner", label: "Dashboard", icon: "dashboard" },
  { href: "/owner/branding", label: "Branding & Content", icon: "branding" },
  { href: "/owner/categories", label: "Categories", icon: "categories" },
  { href: "/owner/services", label: "Services", icon: "services" },
  { href: "/owner/why", label: "Why Choose Us", icon: "why" },
  { href: "/owner/social", label: "Social Links", icon: "social" },
  { href: "/owner/leads", label: "Leads", icon: "leads" },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionForRole("OWNER");
  if (!session) redirect("/owner/login");
  const cfg = await getSiteConfig();

  return (
    <AdminShell
      brandName={cfg.brandName}
      logoUrl={cfg.logoUrl}
      role="OWNER"
      userName={session.name ?? session.email}
      nav={NAV}
    >
      {children}
    </AdminShell>
  );
}
