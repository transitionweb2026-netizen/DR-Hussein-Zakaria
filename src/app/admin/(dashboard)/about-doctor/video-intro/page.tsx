import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getAboutVideoIntro } from "@/lib/data/about";
import { updateAboutVideoIntro, updateAboutVideoThumbnail } from "./actions";

export default async function AboutVideoIntroPage() {
  const video = await getAboutVideoIntro();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="About Doctor — Intro Video"
        description="The large, prominent video section, third on the /about page. Independent from Home's own intro video -- set a video URL to make this play; leave it blank to keep it as a thumbnail only."
      />

      <MediaUploadField label="Video thumbnail" currentUrl={video?.thumbnail_url ?? null} action={updateAboutVideoThumbnail} />

      <AdminForm action={updateAboutVideoIntro}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={video?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={video?.heading} />
        <TranslatableInput name="description" label="Description" defaultValue={video?.description} multiline rows={3} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field name="duration" label="Duration badge (e.g. 03:40)" defaultValue={video?.duration} />
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
      </AdminForm>
    </div>
  );
}
