import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getHomeHero } from "@/lib/data/home";
import { updateHomeHero, updateHeroBackground } from "./actions";

export default async function HomeHeroPage() {
  const hero = await getHomeHero();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Home — Hero" description="The first thing visitors see. If no image is set here, the sitewide default hero background (Global Settings → Branding) is used." />

      <MediaUploadField label="Background image" currentUrl={hero?.background_url ?? null} action={updateHeroBackground} />

      <AdminForm action={updateHomeHero}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={hero?.eyebrow} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="heading_prefix" label="Heading (first part)" defaultValue={hero?.heading_prefix} />
          <TranslatableInput name="heading_highlight" label="Heading (highlighted part)" defaultValue={hero?.heading_highlight} />
        </div>
        <TranslatableInput name="paragraph" label="Paragraph" defaultValue={hero?.paragraph} multiline rows={3} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="cta_primary_label" label="Primary button label" defaultValue={hero?.cta_primary_label} />
          <TranslatableInput name="cta_secondary_label" label="Secondary button label" defaultValue={hero?.cta_secondary_label} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="phone_label" label="Phone card label" defaultValue={hero?.phone_label} />
          <TranslatableInput name="social_label" label="Social icons accessible label" defaultValue={hero?.social_label} />
        </div>
      </AdminForm>
    </div>
  );
}
