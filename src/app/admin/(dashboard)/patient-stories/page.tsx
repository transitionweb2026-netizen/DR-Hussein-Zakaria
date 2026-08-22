import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getPatientStoriesPageContent, getAllPatientStories } from "@/lib/data/patient-stories";
import { updatePageContent, addStory, updateStory, deleteStory, moveStory, updateStoryImage } from "./actions";

export default async function PatientStoriesAdminPage() {
  const [content, items] = await Promise.all([getPatientStoriesPageContent(), getAllPatientStories()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Patient Stories"
        description="The /patient-stories page's hero, intro copy, and every story. Only non-sensitive narrative fields are collected -- no medical record numbers or identifying details beyond a display name."
      />

      <AdminForm action={updatePageContent} saveLabel="Save page content">
        <TranslatableInput name="hero_eyebrow" label="Hero eyebrow" defaultValue={content?.hero_eyebrow} />
        <TranslatableInput name="hero_heading_prefix" label="Hero heading (first part)" defaultValue={content?.hero_heading_prefix} />
        <TranslatableInput name="hero_heading_highlight" label="Hero heading (highlighted part)" defaultValue={content?.hero_heading_highlight} />
        <TranslatableInput name="hero_paragraph" label="Hero paragraph" defaultValue={content?.hero_paragraph} multiline />
        <TranslatableInput name="intro_eyebrow" label="Stories intro eyebrow" defaultValue={content?.intro_eyebrow} />
        <TranslatableInput name="intro_heading" label="Stories intro heading" defaultValue={content?.intro_heading} />
        <TranslatableInput name="reviews_intro_eyebrow" label="Reviews intro eyebrow" defaultValue={content?.reviews_intro_eyebrow} />
        <TranslatableInput name="reviews_intro_heading" label="Reviews intro heading" defaultValue={content?.reviews_intro_heading} />
        <TranslatableInput name="read_story_label" label='"Read Full Story" link label' defaultValue={content?.read_story_label} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TranslatableInput name="label_condition" label='"The Condition" label' defaultValue={content?.label_condition} />
          <TranslatableInput name="label_journey" label='"The Treatment Journey" label' defaultValue={content?.label_journey} />
          <TranslatableInput name="label_outcome" label='"The Outcome" label' defaultValue={content?.label_outcome} />
        </div>
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Stories</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <MediaUploadField label="Story image" currentUrl={item.image_url} action={updateStoryImage} hiddenFields={{ id: item.id }} size={72} />
              <form action={updateStory} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="name" label="Patient display name" defaultValue={item.name} />
                <TranslatableInput name="title" label="Story title" defaultValue={item.title} />
                <TranslatableInput name="condition" label="The condition" defaultValue={item.condition} multiline rows={2} />
                <TranslatableInput name="journey" label="The treatment journey" defaultValue={item.journey} multiline rows={2} />
                <TranslatableInput name="outcome" label="The outcome" defaultValue={item.outcome} multiline rows={2} />
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
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveStory} deleteAction={deleteStory} />
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No stories yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add story</h2>
        <form action={addStory} className="space-y-3">
          <TranslatableInput name="name" label="Patient display name" />
          <TranslatableInput name="title" label="Story title" />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add story
          </button>
        </form>
      </div>
    </div>
  );
}
