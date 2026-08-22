import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getAboutPageContent } from "@/lib/data/about";
import { updateBiography, updateDoctorImage } from "./actions";

export default async function AboutBiographyPage() {
  const content = await getAboutPageContent();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="About Doctor — Biography" description="The doctor's full biography and portrait shown on the /about page." />

      <MediaUploadField label="Doctor photo" currentUrl={content?.doctor_image_url ?? null} action={updateDoctorImage} size={140} />

      <AdminForm action={updateBiography}>
        <TranslatableInput name="biography_eyebrow" label="Section eyebrow" defaultValue={content?.biography_eyebrow} />
        <TranslatableInput name="biography_heading" label="Section heading" defaultValue={content?.biography_heading} />
        <TranslatableInput name="biography" label="Biography" defaultValue={content?.biography} multiline rows={8} />
      </AdminForm>
    </div>
  );
}
