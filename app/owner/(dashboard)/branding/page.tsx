import { updateSiteConfig } from "@/app/actions/owner";
import { AdminHeader, Card, Field, inputCls, labelCls } from "@/components/admin/ui";
import { SubmitButton, ImageUploader } from "@/components/admin/controls";
import { getSiteConfig } from "@/lib/site";
import { parseImages } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  const cfg = await getSiteConfig();
  return (
    <>
      <AdminHeader title="Branding & content" description="Logo, colors and the words shown across your site." />
      <form action={updateSiteConfig} className="grid gap-4">
        <Card>
          <h2 className="mb-4 font-serif text-xl text-ink">Identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand name"><input name="brandName" defaultValue={cfg.brandName} className={inputCls} /></Field>
            <Field label="Tagline"><input name="tagline" defaultValue={cfg.tagline} className={inputCls} /></Field>
          </div>
          <div className="mt-4">
            <p className="mb-1 text-xs font-medium text-ink/70">Logo</p>
            <ImageUploader name="logoUrl" initial={cfg.logoUrl ? [cfg.logoUrl] : []} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Primary color">
              <input name="primaryColor" type="color" defaultValue={cfg.primaryColor} className="h-11 w-full rounded-xl border border-ink/12 bg-white px-2" />
            </Field>
            <Field label="Accent color">
              <input name="accentColor" type="color" defaultValue={cfg.accentColor} className="h-11 w-full rounded-xl border border-ink/12 bg-white px-2" />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl text-ink">Homepage hero</h2>
          <div className="grid gap-4">
            <Field label="Hero headline"><input name="heroHeadline" defaultValue={cfg.heroHeadline} className={inputCls} /></Field>
            <Field label="Hero subtext"><textarea name="heroSubtext" defaultValue={cfg.heroSubtext} rows={3} className={inputCls} /></Field>
            <div>
              <p className={labelCls}>Homepage hero images (up to 3 — the collage beside the headline)</p>
              <ImageUploader name="heroImages" multiple initial={parseImages(cfg.heroImages)} />
              <p className="mt-1.5 text-xs text-muted">
                Leave empty to automatically use your first 3 category images. The 1st image is shown large.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl text-ink">About section</h2>
          <div className="grid gap-4">
            <Field label="About title"><input name="aboutTitle" defaultValue={cfg.aboutTitle} className={inputCls} /></Field>
            <Field label="About body"><textarea name="aboutBody" defaultValue={cfg.aboutBody} rows={6} className={inputCls} /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl text-ink">Footer & SEO</h2>
          <div className="grid gap-4">
            <Field label="Footer tagline"><input name="footerTagline" defaultValue={cfg.footerTagline} className={inputCls} /></Field>
            <Field label="Meta title (browser tab & Google)"><input name="metaTitle" defaultValue={cfg.metaTitle} className={inputCls} /></Field>
            <Field label="Meta description"><textarea name="metaDescription" defaultValue={cfg.metaDescription} rows={2} className={inputCls} /></Field>
          </div>
        </Card>

        <div className="flex justify-end">
          <SubmitButton>Save changes</SubmitButton>
        </div>
      </form>
    </>
  );
}
