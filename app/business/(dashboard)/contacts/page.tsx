import { prisma } from "@/lib/db";
import { createContact, updateContact, deleteContact } from "@/app/actions/business";
import { AdminHeader, Card, Field, inputCls } from "@/components/admin/ui";
import { SubmitButton, DeleteSubmit, Collapsible } from "@/components/admin/controls";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await prisma.contactDetail.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <AdminHeader title="Contact details" description="Phone numbers, WhatsApp, email and address shown across the site. Mark one as primary." />

      <div className="mb-6">
        <Collapsible label="Add a contact">
          <form action={createContact} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label"><input name="label" required className={inputCls} placeholder="e.g. Sales" /></Field>
              <Field label="Order"><input name="order" type="number" defaultValue={0} className={inputCls} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Phone"><input name="phone" className={inputCls} placeholder="+91 …" /></Field>
              <Field label="WhatsApp"><input name="whatsapp" className={inputCls} placeholder="+91 …" /></Field>
            </div>
            <Field label="Email"><input name="email" type="email" className={inputCls} /></Field>
            <Field label="Address"><textarea name="address" rows={2} className={inputCls} /></Field>
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input type="checkbox" name="isPrimary" className="h-4 w-4 accent-green" /> Primary (used in header & WhatsApp button)
            </label>
            <div className="flex justify-end"><SubmitButton>Add contact</SubmitButton></div>
          </form>
        </Collapsible>
      </div>

      <div className="grid gap-4">
        {contacts.map((c) => (
          <Card key={c.id}>
            <form action={updateContact} className="grid gap-3">
              <input type="hidden" name="id" value={c.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Label"><input name="label" defaultValue={c.label} className={inputCls} /></Field>
                <Field label="Order"><input name="order" type="number" defaultValue={c.order} className={inputCls} /></Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone"><input name="phone" defaultValue={c.phone ?? ""} className={inputCls} /></Field>
                <Field label="WhatsApp"><input name="whatsapp" defaultValue={c.whatsapp ?? ""} className={inputCls} /></Field>
              </div>
              <Field label="Email"><input name="email" defaultValue={c.email ?? ""} className={inputCls} /></Field>
              <Field label="Address"><textarea name="address" defaultValue={c.address ?? ""} rows={2} className={inputCls} /></Field>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-ink/80">
                  <input type="checkbox" name="isPrimary" defaultChecked={c.isPrimary} className="h-4 w-4 accent-green" /> Primary
                </label>
                <div className="flex items-center gap-2">
                  <DeleteSubmit action={deleteContact} />
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
