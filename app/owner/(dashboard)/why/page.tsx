import { prisma } from "@/lib/db";
import { createWhy, updateWhy, deleteWhy } from "@/app/actions/owner";
import { AdminHeader, Card, Field, inputCls } from "@/components/admin/ui";
import { SubmitButton, DeleteSubmit, Collapsible } from "@/components/admin/controls";
import { ICON_OPTIONS } from "@/lib/icons";

export const dynamic = "force-dynamic";

function IconSelect({ value }: { value?: string }) {
  return (
    <select name="icon" defaultValue={value ?? "BadgeCheck"} className={inputCls}>
      {ICON_OPTIONS.map((i) => (
        <option key={i} value={i}>{i}</option>
      ))}
    </select>
  );
}

export default async function WhyPage() {
  const items = await prisma.whyChooseUs.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <AdminHeader title="Why choose us" description="Trust points shown on the homepage and About page." />

      <div className="mb-6">
        <Collapsible label="Add a point">
          <form action={createWhy} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_200px_120px]">
              <Field label="Title"><input name="title" required className={inputCls} placeholder="e.g. On-time installation" /></Field>
              <Field label="Icon"><IconSelect /></Field>
              <Field label="Order"><input name="order" type="number" defaultValue={0} className={inputCls} /></Field>
            </div>
            <Field label="Text"><textarea name="text" rows={2} className={inputCls} /></Field>
            <div className="flex justify-end"><SubmitButton>Add point</SubmitButton></div>
          </form>
        </Collapsible>
      </div>

      <div className="grid gap-4">
        {items.map((w) => (
          <Card key={w.id}>
            <form action={updateWhy} className="grid gap-3">
              <input type="hidden" name="id" value={w.id} />
              <div className="grid gap-3 sm:grid-cols-[1fr_200px_120px]">
                <Field label="Title"><input name="title" defaultValue={w.title} className={inputCls} /></Field>
                <Field label="Icon"><IconSelect value={w.icon} /></Field>
                <Field label="Order"><input name="order" type="number" defaultValue={w.order} className={inputCls} /></Field>
              </div>
              <Field label="Text"><textarea name="text" defaultValue={w.text} rows={2} className={inputCls} /></Field>
              <div className="flex justify-end gap-2">
                <DeleteSubmit action={deleteWhy} />
                <SubmitButton variant="soft">Save</SubmitButton>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
