import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getHomeVideoIntro } from "@/lib/data/home";
import { updateHomeVideoIntro, updateVideoIntroThumbnail } from "./actions";

export default async function HomeVideoIntroPage() {
  const video = await getHomeVideoIntro();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Home — Intro Video"
        description="Set a video URL to make this section play a real video; leave it blank to keep it as a decorative thumbnail."
      />

      <MediaUploadField label="Thumbnail image" currentUrl={video?.thumbnail_url ?? null} action={updateVideoIntroThumbnail} />

      <AdminForm action={updateHomeVideoIntro}>
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={video?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={video?.heading} />
        <TranslatableInput name="description" label="Description" defaultValue={video?.description} multiline rows={3} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="duration" label="Duration badge (e.g. 02:14)" defaultValue={video?.duration} />
          <Field name="video_url" label="Video URL (optional)" defaultValue={video?.video_url ?? ""} dir="ltr" />
        </div>
      </AdminForm>
    </div>
  );
}
