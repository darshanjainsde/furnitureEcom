import { prisma } from "@/lib/db";
import { createSocial, updateSocial, deleteSocial } from "@/app/actions/owner";
import { AdminHeader, Card, Field, inputCls } from "@/components/admin/ui";
import { SubmitButton, DeleteSubmit, Collapsible } from "@/components/admin/controls";
import { SOCIAL_OPTIONS, SocialIcon } from "@/lib/icons";

export const dynamic = "force-dynamic";

function PlatformSelect({ value }: { value?: string }) {
  return (
    <select name="platform" defaultValue={value ?? "instagram"} className={inputCls}>
      {SOCIAL_OPTIONS.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  );
}

export default async function SocialPage() {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <AdminHeader title="Social links" description="Connect your social profiles — shown in the header, footer and contact page." />

      <div className="mb-6">
        <Collapsible label="Add a social link">
          <form action={createSocial} className="grid gap-3 sm:grid-cols-[200px_1fr_120px] sm:items-end">
            <Field label="Platform"><PlatformSelect /></Field>
            <Field label="URL"><input name="url" required className={inputCls} placeholder="https://instagram.com/yourbrand" /></Field>
            <SubmitButton>Add</SubmitButton>
          </form>
        </Collapsible>
      </div>

      <div className="grid gap-3">
        {links.map((l) => (
          <Card key={l.id}>
            <form action={updateSocial} className="grid gap-3 sm:grid-cols-[40px_180px_1fr_auto] sm:items-end">
              <input type="hidden" name="id" value={l.id} />
              <div className="flex h-11 w-10 items-center justify-center rounded-xl bg-green/8 text-green">
                <SocialIcon platform={l.platform} className="h-4 w-4" />
              </div>
              <Field label="Platform"><PlatformSelect value={l.platform} /></Field>
              <Field label="URL"><input name="url" defaultValue={l.url} className={inputCls} /></Field>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-ink/80">
                  <input type="checkbox" name="isActive" defaultChecked={l.isActive} className="h-4 w-4 accent-green" /> Active
                </label>
                <DeleteSubmit action={deleteSocial} />
                <SubmitButton variant="soft">Save</SubmitButton>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
