import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getHomeAbout, getHomeVideoIntro } from "@/lib/data/home";
import { updateHomeAbout, updateHomeVideo, updateVideoThumbnail } from "./actions";

export default async function HomeAboutPage() {
  const [about, video] = await Promise.all([getHomeAbout(), getHomeVideoIntro()]);

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Home — About Doctor"
        description="The combined text + video introduction section, second on the homepage."
      />

      <AdminForm action={updateHomeAbout} saveLabel="Save text">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={about?.eyebrow} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="heading_prefix" label="Heading (first part)" defaultValue={about?.heading_prefix} />
          <TranslatableInput name="heading_highlight" label="Heading (highlighted part)" defaultValue={about?.heading_highlight} />
        </div>
        <TranslatableInput name="paragraph_1" label="Paragraph 1" defaultValue={about?.paragraph_1} multiline rows={3} />
        <TranslatableInput name="paragraph_2" label="Paragraph 2" defaultValue={about?.paragraph_2} multiline rows={3} />
        <TranslatableInput name="cta_label" label='Button label (links to the About Doctor page)' defaultValue={about?.cta_label} />
      </AdminForm>

      <div className="space-y-6 border-t border-admin-border pt-8">
        <h2 className="text-sm font-semibold text-admin-text">Video</h2>
        <MediaUploadField label="Video thumbnail" currentUrl={video?.thumbnail_url ?? null} action={updateVideoThumbnail} />

        <AdminForm action={updateHomeVideo} saveLabel="Save video">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field name="duration" label="Duration badge (e.g. 02:14)" defaultValue={video?.duration} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">Provider</label>
              <select
                name="video_provider"
                defaultValue={video?.video_provider ?? ""}
                className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
              >
                <option value="">None (thumbnail only)</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="mp4">Direct MP4</option>
              </select>
            </div>
            <Field name="video_url" label="Video URL (optional)" defaultValue={video?.video_url ?? ""} dir="ltr" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TranslatableInput name="doctor_name" label="Caption name (shown on the video)" defaultValue={about?.doctor_name} />
            <TranslatableInput name="doctor_title" label="Caption title (shown on the video)" defaultValue={about?.doctor_title} />
          </div>
        </AdminForm>
      </div>
    </div>
  );
}
