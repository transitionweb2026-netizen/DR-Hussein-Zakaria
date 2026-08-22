import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getServicesPageContent } from "@/lib/data/services";
import { updateServicesHero } from "./actions";

export default async function ServicesHeroPage() {
  const content = await getServicesPageContent();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Services — Hero"
        description="The banner at the top of the /services page. Background image falls back to Global Settings → Branding's default hero image."
      />
      <AdminForm action={updateServicesHero}>
        <TranslatableInput name="hero_eyebrow" label="Eyebrow" defaultValue={content?.hero_eyebrow} />
        <TranslatableInput name="hero_heading_prefix" label="Heading (first part)" defaultValue={content?.hero_heading_prefix} />
        <TranslatableInput name="hero_heading_highlight" label="Heading (highlighted part)" defaultValue={content?.hero_heading_highlight} />
        <TranslatableInput name="hero_paragraph" label="Paragraph" defaultValue={content?.hero_paragraph} multiline />
      </AdminForm>
    </div>
  );
}
