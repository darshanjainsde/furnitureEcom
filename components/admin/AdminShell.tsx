"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, FolderTree, Sparkles, Star, Share2, Inbox, Phone, Package,
  Settings, Menu, X, LogOut, ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard, categories: FolderTree, services: Sparkles, why: Star,
  social: Share2, leads: Inbox, contacts: Phone, products: Package, branding: Settings,
};

export type NavItem = { href: string; label: string; icon: keyof typeof ICONS };

export function AdminShell({
  brandName,
  role,
  userName,
  nav,
  children,
}: {
  brandName: string;
  logoUrl?: string;
  role: "OWNER" | "BUSINESS";
  userName?: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const portalLabel = role === "OWNER" ? "Owner Portal" : "Business Portal";

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        {/* reverse mark for the dark sidebar (keeps the ink wordmark legible) */}
        <Image src="/brand/finokraft-joinery-reverse.svg" alt={brandName} width={150} height={45} className="h-7 w-auto" />
      </div>
      <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-cream/40">
        {portalLabel}
      </p>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const I = ICONS[item.icon] ?? LayoutDashboard;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active ? "bg-cream/15 text-cream" : "text-cream/70 hover:bg-cream/10 hover:text-cream",
              )}
            >
              <I className="h-4.5 w-4.5" strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-cream/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-cream"
        >
          <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.7} /> View website
        </Link>
        <form action={logoutAction}>
          <input type="hidden" name="role" value={role} />
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-cream">
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.7} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-200 lg:flex">
      {/* desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-green-900 lg:block">
        <div className="sticky top-0 h-screen">{SidebarInner}</div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-green-900">{SidebarInner}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink/8 bg-white px-4 lg:px-8">
          <button className="rounded-lg p-2 text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden text-sm text-muted lg:block">{portalLabel}</span>
          <span className="text-sm font-medium text-ink">{userName ?? brandName}</span>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
