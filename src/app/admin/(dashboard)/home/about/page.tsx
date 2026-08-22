import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getHomeAbout } from "@/lib/data/home";
import { updateHomeAbout, updateAboutDoctorImage } from "./actions";

export default async function HomeAboutPage() {
  const about = await getHomeAbout();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Home — About Doctor" description="The card-stack intro section on the homepage." />

      <MediaUploadField label="Doctor photo" currentUrl={about?.doctor_image_url ?? null} action={updateAboutDoctorImage} />

      <AdminForm action={updateHomeAbout}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={about?.eyebrow} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="heading_prefix" label="Heading (first part)" defaultValue={about?.heading_prefix} />
          <TranslatableInput name="heading_highlight" label="Heading (highlighted part)" defaultValue={about?.heading_highlight} />
        </div>
        <TranslatableInput name="paragraph_1" label="Paragraph 1" defaultValue={about?.paragraph_1} multiline rows={3} />
        <TranslatableInput name="paragraph_2" label="Paragraph 2" defaultValue={about?.paragraph_2} multiline rows={3} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="doctor_name" label="Doctor name (on photo card)" defaultValue={about?.doctor_name} />
          <TranslatableInput name="doctor_title" label="Doctor title (on photo card)" defaultValue={about?.doctor_title} />
        </div>
        <TranslatableInput name="cta_label" label="Button label" defaultValue={about?.cta_label} />
      </AdminForm>
    </div>
  );
}
