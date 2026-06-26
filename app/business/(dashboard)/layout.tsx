import { redirect } from "next/navigation";
import { AdminShell, type NavItem } from "@/components/admin/AdminShell";
import { getSessionForRole } from "@/lib/auth";
import { getSiteConfig } from "@/lib/site";

const NAV: NavItem[] = [
  { href: "/business", label: "Dashboard", icon: "dashboard" },
  { href: "/business/leads", label: "Leads", icon: "leads" },
  { href: "/business/products", label: "Products", icon: "products" },
  { href: "/business/contacts", label: "Contact Details", icon: "contacts" },
];

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionForRole("BUSINESS");
  if (!session) redirect("/business/login");
  const cfg = await getSiteConfig();

  return (
    <AdminShell
      brandName={cfg.brandName}
      logoUrl={cfg.logoUrl}
      role="BUSINESS"
      userName={session.name ?? session.email}
      nav={NAV}
    >
      {children}
    </AdminShell>
  );
}
