import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getVideosPageContent, getAllVideos } from "@/lib/data/videos";
import { updatePageContent, addVideo, updateVideo, deleteVideo, moveVideo, updateVideoThumbnail } from "./actions";

export default async function VideosAdminPage() {
  const [content, items] = await Promise.all([getVideosPageContent(), getAllVideos()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Videos" description="The /videos page's hero, intro copy, and the full video library." />

      <AdminForm action={updatePageContent} saveLabel="Save page content">
        <TranslatableInput name="hero_eyebrow" label="Hero eyebrow" defaultValue={content?.hero_eyebrow} />
        <TranslatableInput name="hero_heading_prefix" label="Hero heading (first part)" defaultValue={content?.hero_heading_prefix} />
        <TranslatableInput name="hero_heading_highlight" label="Hero heading (highlighted part)" defaultValue={content?.hero_heading_highlight} />
        <TranslatableInput name="hero_paragraph" label="Hero paragraph" defaultValue={content?.hero_paragraph} multiline />
        <TranslatableInput name="intro_eyebrow" label="Intro eyebrow" defaultValue={content?.intro_eyebrow} />
        <TranslatableInput name="intro_heading" label="Intro heading" defaultValue={content?.intro_heading} />
        <TranslatableInput name="intro_description" label="Intro description" defaultValue={content?.intro_description} multiline rows={2} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Videos</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <MediaUploadField
                label="Thumbnail"
                currentUrl={item.thumbnail_url}
                action={updateVideoThumbnail}
                hiddenFields={{ id: item.id }}
                size={72}
              />
              <form action={updateVideo} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="title" label="Title" defaultValue={item.title} />
                <TranslatableInput name="description" label="Description" defaultValue={item.description} multiline rows={2} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field name="duration" label="Duration" defaultValue={item.duration} placeholder="05:24" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-admin-text">Provider</label>
                    <select
                      name="video_provider"
                      defaultValue={item.video_provider ?? ""}
                      className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                    >
                      <option value="">None (thumbnail only)</option>
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="mp4">Direct MP4</option>
                    </select>
                  </div>
                  <Field name="video_url" label="Video URL" defaultValue={item.video_url ?? ""} dir="ltr" placeholder="https://..." />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-admin-text">
                    <input type="checkbox" name="published" defaultChecked={item.status === "published"} className="h-4 w-4 rounded" />
                    Published
                  </label>
                  <button type="submit" className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                    Save
                  </button>
                </div>
              </form>
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveVideo} deleteAction={deleteVideo} />
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No videos yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add video</h2>
        <form action={addVideo} className="space-y-3">
          <TranslatableInput name="title" label="Title" />
          <TranslatableInput name="description" label="Description" multiline rows={2} />
          <Field name="duration" label="Duration" placeholder="05:24" />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add video
          </button>
        </form>
      </div>
    </div>
  );
}
