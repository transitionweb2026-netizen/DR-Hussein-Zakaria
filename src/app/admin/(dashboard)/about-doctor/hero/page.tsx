import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getAboutPageContent } from "@/lib/data/about";
import { updateAboutHero } from "./actions";

export default async function AboutHeroPage() {
  const content = await getAboutPageContent();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="About Doctor — Hero"
        description="The banner at the top of the /about page. Background image falls back to Global Settings → Branding's default hero image."
      />
      <AdminForm action={updateAboutHero}>
        <TranslatableInput name="hero_eyebrow" label="Eyebrow" defaultValue={content?.hero_eyebrow} />
        <TranslatableInput name="hero_heading_prefix" label="Heading (first part)" defaultValue={content?.hero_heading_prefix} />
        <TranslatableInput name="hero_heading_highlight" label="Heading (highlighted part)" defaultValue={content?.hero_heading_highlight} />
        <TranslatableInput name="hero_paragraph" label="Paragraph" defaultValue={content?.hero_paragraph} multiline />
        <TranslatableInput name="hero_cta_label" label="CTA button label" defaultValue={content?.hero_cta_label} />
      </AdminForm>
    </div>
  );
}
