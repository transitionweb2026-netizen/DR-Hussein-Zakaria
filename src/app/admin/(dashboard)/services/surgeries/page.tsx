import Image from "next/image";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getServicesPageContent, getAllSurgeries, getAllSurgeryImagesFor } from "@/lib/data/services";
import { getAllServiceCategories } from "@/lib/data/shared-content";
import { serializeFaqLines } from "@/lib/admin/faq-format";
import { GalleryUploadForm } from "./gallery-upload-form";
import {
  updateDetailedHeading,
  addSurgery,
  updateSurgery,
  deleteSurgery,
  moveSurgery,
  updateSurgeryImage,
  addGalleryImage,
  deleteGalleryImage,
} from "./actions";

export default async function ServicesSurgeriesPage() {
  const [content, categories, surgeries] = await Promise.all([
    getServicesPageContent(),
    getAllServiceCategories(),
    getAllSurgeries(),
  ]);
  const galleries = await getAllSurgeryImagesFor(surgeries.map((s) => s.id));

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="Services — Detailed Surgeries"
        description="Each surgery belongs to a category (managed in Home → Specialties). Full description, symptoms, treatment info, FAQ, video, and gallery images are all editable per surgery."
      />

      <AdminForm action={updateDetailedHeading} saveLabel="Save heading">
        <TranslatableInput name="detailed_heading" label="Section heading" defaultValue={content?.detailed_heading} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="symptoms_label" label='"Symptoms" sub-heading (shown in every surgery popup)' defaultValue={content?.symptoms_label} />
          <TranslatableInput name="treatment_label" label='"Treatment" sub-heading (shown in every surgery popup)' defaultValue={content?.treatment_label} />
        </div>
      </AdminForm>

      {categories.map((category) => {
        const categorySurgeries = surgeries.filter((s) => s.category_id === category.id);
        return (
          <details key={category.id} className="rounded-xl border border-admin-border bg-admin-surface p-4" open>
            <summary className="cursor-pointer text-sm font-semibold text-admin-text">
              {category.title.en || category.title.ar || category.slug}{" "}
              <span className="font-normal text-admin-muted">({categorySurgeries.length} surgeries)</span>
            </summary>

            <div className="mt-4 space-y-3">
              {categorySurgeries.map((surgery, i) => {
                const faqText = serializeFaqLines(surgery.faq);
                const gallery = galleries[surgery.id] ?? [];
                return (
                  <div key={surgery.id} className="rounded-lg border border-admin-border bg-admin-bg p-4">
                    <p className="mb-3 font-mono text-xs text-admin-muted">slug: {surgery.slug}</p>
                    <MediaUploadField
                      label="Primary image"
                      currentUrl={surgery.primary_image_url}
                      action={updateSurgeryImage}
                      hiddenFields={{ id: surgery.id }}
                      size={72}
                    />

                    <form action={updateSurgery} className="mt-4 space-y-3">
                      <input type="hidden" name="id" value={surgery.id} />
                      <input type="hidden" name="category_id" value={category.id} />
                      <TranslatableInput name="title" label="Title" defaultValue={surgery.title} />
                      <TranslatableInput name="short_description" label="Short description (card summary)" defaultValue={surgery.short_description} multiline rows={2} />
                      <TranslatableInput name="full_description" label="Full description (detail view)" defaultValue={surgery.full_description} multiline rows={4} />
                      <TranslatableInput name="symptoms" label="Symptoms (optional)" defaultValue={surgery.symptoms ?? undefined} multiline rows={3} />
                      <TranslatableInput name="treatment_info" label="Treatment info (optional)" defaultValue={surgery.treatment_info ?? undefined} multiline rows={3} />
                      <TranslatableInput
                        name="faq"
                        label='FAQ (optional) — one per line, "Question :: Answer"'
                        defaultValue={faqText}
                        multiline
                        rows={3}
                        placeholder={{ en: "How long is recovery? :: Most patients recover within...", ar: "" }}
                      />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-admin-text">Video provider</label>
                          <select
                            name="video_provider"
                            defaultValue={surgery.video_provider ?? ""}
                            className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                          >
                            <option value="">None</option>
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="mp4">Direct MP4</option>
                          </select>
                        </div>
                        <Field name="video_url" label="Video URL (optional)" defaultValue={surgery.video_url ?? ""} dir="ltr" placeholder="https://..." />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-admin-text">
                          <input type="checkbox" name="published" defaultChecked={surgery.status === "published"} className="h-4 w-4 rounded" />
                          Published
                        </label>
                        <button type="submit" className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                          Save
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 border-t border-admin-border pt-3">
                      <p className="mb-2 text-xs font-semibold text-admin-text">Additional gallery images</p>
                      <div className="flex flex-wrap gap-2">
                        {gallery.map((img) => (
                          <div key={img.id} className="relative">
                            {img.url && (
                              <Image
                                src={img.url}
                                alt=""
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-md border border-admin-border object-cover"
                              />
                            )}
                            <form action={deleteGalleryImage} className="absolute -right-1.5 -top-1.5">
                              <input type="hidden" name="id" value={img.id} />
                              <input type="hidden" name="surgery_id" value={surgery.id} />
                              <button type="submit" className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-danger text-[10px] font-bold text-white">
                                ×
                              </button>
                            </form>
                          </div>
                        ))}
                        <GalleryUploadForm surgeryId={surgery.id} action={addGalleryImage} />
                      </div>
                    </div>

                    <ReorderDeleteControls
                      id={surgery.id}
                      isFirst={i === 0}
                      isLast={i === categorySurgeries.length - 1}
                      moveAction={moveSurgery}
                      deleteAction={deleteSurgery}
                    />
                  </div>
                );
              })}
              {categorySurgeries.length === 0 && <p className="text-sm text-admin-muted">No surgeries in this category yet.</p>}
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-admin-border p-4">
              <p className="mb-3 text-xs font-semibold text-admin-text">Add surgery to {category.title.en || category.slug}</p>
              <form action={addSurgery} className="space-y-3">
                <input type="hidden" name="category_id" value={category.id} />
                <TranslatableInput name="title" label="Title" />
                <TranslatableInput name="short_description" label="Short description" multiline rows={2} />
                <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                  <Plus className="h-3.5 w-3.5" />
                  Add surgery
                </button>
              </form>
            </div>
          </details>
        );
      })}
    </div>
  );
}
