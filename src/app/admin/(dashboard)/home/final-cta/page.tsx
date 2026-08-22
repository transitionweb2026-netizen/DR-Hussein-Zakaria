import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getFinalCtaContent } from "@/lib/data/global-settings";
import { updateFinalCta } from "./actions";

export default async function HomeFinalCtaPage() {
  const cta = await getFinalCtaContent();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Home — Final CTA"
        description="The sitewide default WhatsApp/Call banner shown at the bottom of every page. The Services page overrides the title/subtitle only, set separately from Services → CTA. The WhatsApp and phone numbers themselves come from Global Settings → Contact Info."
      />
      <AdminForm action={updateFinalCta}>
        <TranslatableInput name="title" label="Title" defaultValue={cta?.title} />
        <TranslatableInput name="subtitle" label="Subtitle" defaultValue={cta?.subtitle} multiline rows={2} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="whatsapp_label" label="WhatsApp button label" defaultValue={cta?.whatsapp_label} />
          <TranslatableInput name="call_label" label="Call button label" defaultValue={cta?.call_label} />
        </div>
      </AdminForm>
    </div>
  );
}
