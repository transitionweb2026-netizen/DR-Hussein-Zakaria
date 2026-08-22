import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getAboutPageContent } from "@/lib/data/about";
import { updateAboutCta } from "./actions";

export default async function AboutCtaPage() {
  const content = await getAboutPageContent();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="About Doctor — CTA"
        description="Overrides the sitewide WhatsApp/Call banner's title and subtitle for the /about page only. The WhatsApp/Call button labels themselves come from Global Settings."
      />
      <AdminForm action={updateAboutCta}>
        <TranslatableInput name="cta_title" label="Title" defaultValue={content?.cta_title} />
        <TranslatableInput name="cta_subtitle" label="Subtitle" defaultValue={content?.cta_subtitle} multiline rows={2} />
      </AdminForm>
    </div>
  );
}
