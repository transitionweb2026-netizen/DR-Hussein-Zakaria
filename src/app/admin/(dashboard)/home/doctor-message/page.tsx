import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getHomeDoctorMessage } from "@/lib/data/home";
import { updateDoctorMessage, updateDoctorMessagePortrait } from "./actions";

export default async function HomeDoctorMessagePage() {
  const message = await getHomeDoctorMessage();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Home — Doctor Message"
        description="Not currently displayed on the live site -- the Home page was rebuilt to a new 11-section structure that doesn't include this block. Content and image are preserved here in case you want to bring it back on a future page."
      />

      <MediaUploadField label="Portrait photo" currentUrl={message?.portrait_image_url ?? null} action={updateDoctorMessagePortrait} />

      <AdminForm action={updateDoctorMessage}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={message?.eyebrow} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="heading_prefix" label="Heading (first part)" defaultValue={message?.heading_prefix} />
          <TranslatableInput name="heading_highlight" label="Heading (highlighted part)" defaultValue={message?.heading_highlight} />
        </div>
        <TranslatableInput name="quote" label="Quote" defaultValue={message?.quote} multiline rows={4} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="signature_name" label="Signature name" defaultValue={message?.signature_name} />
          <TranslatableInput name="signature_title" label="Signature title" defaultValue={message?.signature_title} />
        </div>
      </AdminForm>
    </div>
  );
}
