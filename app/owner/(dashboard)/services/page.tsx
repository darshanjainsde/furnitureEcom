import { prisma } from "@/lib/db";
import { createService, updateService, deleteService } from "@/app/actions/owner";
import { AdminHeader, Card, Field, inputCls } from "@/components/admin/ui";
import { SubmitButton, DeleteSubmit, Collapsible } from "@/components/admin/controls";
import { ICON_OPTIONS } from "@/lib/icons";

export const dynamic = "force-dynamic";

function IconSelect({ value }: { value?: string }) {
  return (
    <select name="icon" defaultValue={value ?? "Sofa"} className={inputCls}>
      {ICON_OPTIONS.map((i) => (
        <option key={i} value={i}>{i}</option>
      ))}
    </select>
  );
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <AdminHeader title="Services" description="The “what we offer” tiles shown on the homepage." />

      <div className="mb-6">
        <Collapsible label="Add a service">
          <form action={createService} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_200px_120px]">
              <Field label="Title"><input name="title" required className={inputCls} placeholder="e.g. Modular Kitchens" /></Field>
              <Field label="Icon"><IconSelect /></Field>
              <Field label="Order"><input name="order" type="number" defaultValue={0} className={inputCls} /></Field>
            </div>
            <Field label="Short blurb"><textarea name="blurb" rows={2} className={inputCls} /></Field>
            <div className="flex justify-end"><SubmitButton>Add service</SubmitButton></div>
          </form>
        </Collapsible>
      </div>

      <div className="grid gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <form action={updateService} className="grid gap-3">
              <input type="hidden" name="id" value={s.id} />
              <div className="grid gap-3 sm:grid-cols-[1fr_200px_120px]">
                <Field label="Title"><input name="title" defaultValue={s.title} className={inputCls} /></Field>
                <Field label="Icon"><IconSelect value={s.icon} /></Field>
                <Field label="Order"><input name="order" type="number" defaultValue={s.order} className={inputCls} /></Field>
              </div>
              <Field label="Short blurb"><textarea name="blurb" defaultValue={s.blurb} rows={2} className={inputCls} /></Field>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-ink/80">
                  <input type="checkbox" name="isActive" defaultChecked={s.isActive} className="h-4 w-4 accent-green" /> Active
                </label>
                <div className="flex items-center gap-2">
                  <DeleteSubmit action={deleteService} />
                  <SubmitButton variant="soft">Save</SubmitButton>
                </div>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
