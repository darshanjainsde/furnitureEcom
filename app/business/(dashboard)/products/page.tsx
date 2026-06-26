import { prisma } from "@/lib/db";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/business";
import { AdminHeader, Card, Field, inputCls, labelCls } from "@/components/admin/ui";
import { SubmitButton, DeleteSubmit, Collapsible, ImageUploader } from "@/components/admin/controls";
import { parseImages } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Opt = { id: string; label: string };

function CategorySelect({ options, value }: { options: Opt[]; value?: string | null }) {
  return (
    <select name="categoryId" defaultValue={value ?? ""} className={inputCls}>
      <option value="">— Uncategorised —</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>{o.label}</option>
      ))}
    </select>
  );
}

export default async function ProductsPage() {
  const [products, cats] = await Promise.all([
    prisma.product.findMany({ orderBy: [{ isFeatured: "desc" }, { order: "asc" }], include: { category: true } }),
    prisma.category.findMany({ orderBy: { order: "asc" }, include: { parent: true } }),
  ]);

  const options: Opt[] = cats.map((c) => ({
    id: c.id,
    label: c.parent ? `${c.parent.name} / ${c.name}` : c.name,
  }));

  return (
    <>
      <AdminHeader title="Products" description="Add your work with photos. These appear under categories and in “Our Work”." />

      <div className="mb-6">
        <Collapsible label="Add a product">
          <form action={createProduct} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input name="title" required className={inputCls} placeholder="e.g. L-shaped Modular Kitchen" /></Field>
              <Field label="Category"><CategorySelect options={options} /></Field>
            </div>
            <Field label="Description"><textarea name="description" rows={3} className={inputCls} /></Field>
            <div>
              <p className={labelCls}>Photos</p>
              <ImageUploader name="images" multiple />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
              <Field label="Video URL (optional — YouTube/file link)"><input name="videoUrl" className={inputCls} placeholder="https://…" /></Field>
              <Field label="Order"><input name="order" type="number" defaultValue={0} className={inputCls} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input type="checkbox" name="isFeatured" className="h-4 w-4 accent-green" /> Feature on homepage “Our Work”
            </label>
            <div className="flex justify-end"><SubmitButton>Add product</SubmitButton></div>
          </form>
        </Collapsible>
      </div>

      <div className="grid gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <form action={updateProduct} className="grid gap-3">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title"><input name="title" defaultValue={p.title} className={inputCls} /></Field>
                <Field label="Category"><CategorySelect options={options} value={p.categoryId} /></Field>
              </div>
              <Field label="Description"><textarea name="description" defaultValue={p.description ?? ""} rows={3} className={inputCls} /></Field>
              <div>
                <p className={labelCls}>Photos</p>
                <ImageUploader name="images" multiple initial={parseImages(p.images)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <Field label="Video URL (optional)"><input name="videoUrl" defaultValue={p.videoUrl ?? ""} className={inputCls} /></Field>
                <Field label="Order"><input name="order" type="number" defaultValue={p.order} className={inputCls} /></Field>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-ink/80">
                    <input type="checkbox" name="isFeatured" defaultChecked={p.isFeatured} className="h-4 w-4 accent-green" /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink/80">
                    <input type="checkbox" name="isActive" defaultChecked={p.isActive} className="h-4 w-4 accent-green" /> Active
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <DeleteSubmit action={deleteProduct} confirmText={`Delete "${p.title}"?`} />
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
