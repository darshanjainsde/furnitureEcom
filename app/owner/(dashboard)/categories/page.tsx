import { prisma } from "@/lib/db";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/owner";
import { AdminHeader, Card, Field, inputCls, labelCls } from "@/components/admin/ui";
import { SubmitButton, DeleteSubmit, Collapsible, ImageUploader } from "@/components/admin/controls";

export const dynamic = "force-dynamic";

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
};

function EditCategory({ cat, parents }: { cat: Cat; parents: { id: string; name: string }[] }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-white p-4">
      <form action={updateCategory} className="grid gap-3">
        <input type="hidden" name="id" value={cat.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name"><input name="name" defaultValue={cat.name} className={inputCls} /></Field>
          <Field label="Order"><input name="order" type="number" defaultValue={cat.order} className={inputCls} /></Field>
        </div>
        <Field label="Description"><textarea name="description" defaultValue={cat.description ?? ""} rows={2} className={inputCls} /></Field>
        <div>
          <p className={labelCls}>Image</p>
          <ImageUploader name="imageUrl" initial={cat.imageUrl ? [cat.imageUrl] : []} />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input type="checkbox" name="isActive" defaultChecked={cat.isActive} className="h-4 w-4 accent-green" /> Active (visible)
          </label>
          <div className="flex items-center gap-2">
            <DeleteSubmit action={deleteCategory} confirmText={`Delete "${cat.name}"? Subcategories will be unlinked.`} />
            <SubmitButton variant="soft">Save</SubmitButton>
          </div>
        </div>
      </form>
      {parents.length >= 0 && cat.parentId === null && <p className="sr-only">top</p>}
    </div>
  );
}

export default async function CategoriesPage() {
  const tops = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: { children: { orderBy: { order: "asc" } } },
  });
  const parentOptions = tops.map((t) => ({ id: t.id, name: t.name }));

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Top-level collections and their subcategories. These drive the site navigation."
      />

      <div className="mb-6">
        <Collapsible label="Add a category or subcategory">
          <form action={createCategory} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><input name="name" required className={inputCls} placeholder="e.g. Living Room" /></Field>
              <Field label="Parent (leave blank for a top-level collection)">
                <select name="parentId" className={inputCls} defaultValue="">
                  <option value="">— Top-level —</option>
                  {parentOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Description"><textarea name="description" rows={2} className={inputCls} /></Field>
            <div>
              <p className={labelCls}>Image</p>
              <ImageUploader name="imageUrl" />
            </div>
            <div className="flex justify-end"><SubmitButton>Add category</SubmitButton></div>
          </form>
        </Collapsible>
      </div>

      <div className="space-y-6">
        {tops.map((top) => (
          <Card key={top.id}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink">{top.name}</h2>
              <span className="text-xs text-muted">/category/{top.slug}</span>
            </div>
            <EditCategory cat={top} parents={parentOptions} />
            {top.children.length > 0 && (
              <div className="mt-3 space-y-3 border-l-2 border-green/15 pl-4">
                {top.children.map((c) => (
                  <EditCategory key={c.id} cat={c} parents={parentOptions} />
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
