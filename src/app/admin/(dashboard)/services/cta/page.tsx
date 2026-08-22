import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getServicesPageContent } from "@/lib/data/services";
import { updateServicesCta } from "./actions";

export default async function ServicesCtaPage() {
  const content = await getServicesPageContent();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Services — CTA"
        description="Overrides the sitewide WhatsApp/Call banner's title and subtitle for the /services page only."
      />
      <AdminForm action={updateServicesCta}>
        <TranslatableInput name="cta_title" label="Title" defaultValue={content?.cta_title} />
        <TranslatableInput name="cta_subtitle" label="Subtitle" defaultValue={content?.cta_subtitle} multiline rows={2} />
      </AdminForm>
    </div>
  );
}
