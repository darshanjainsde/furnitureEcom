import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Owner Login" };

export default async function OwnerLoginPage() {
  const cfg = await getSiteConfig();
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src={cfg.logoUrl} alt={cfg.brandName} width={170} height={85} className="h-11 w-auto" />
          <p className="eyebrow mt-4 text-walnut">Owner Portal</p>
          <h1 className="mt-1 font-serif text-2xl text-ink">Manage your website</h1>
        </div>
        <div className="rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-card)]">
          <LoginForm role="OWNER" hint="Demo: owner@finokraft.com / owner123" />
        </div>
      </div>
    </div>
  );
}
