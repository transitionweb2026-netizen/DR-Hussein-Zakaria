import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeSpecialtiesSection } from "@/lib/data/home";
import { getAllServiceCategories } from "@/lib/data/shared-content";
import {
  updateSpecialtiesSection,
  addServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  moveServiceCategory,
  updateServiceCategoryImage,
} from "./actions";

export default async function HomeSpecialtiesPage() {
  const [section, items] = await Promise.all([getHomeSpecialtiesSection(), getAllServiceCategories()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Home — Specialties"
        description="Also used as the /services page's category list and the About Doctor page's Specialties section, and each category groups its own detailed surgeries -- edited once here, reflected everywhere."
      />

      <AdminForm action={updateSpecialtiesSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="view_all_label" label='"View All Services" button label' defaultValue={section?.view_all_label} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Specialty categories</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <p className="mb-3 font-mono text-xs text-admin-muted">slug: {item.slug}</p>
              <MediaUploadField
                label="Category image"
                currentUrl={item.image_url}
                action={updateServiceCategoryImage}
                hiddenFields={{ id: item.id }}
                size={64}
              />
              <form action={updateServiceCategory} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="title" label="Title" defaultValue={item.title} />
                <TranslatableInput name="description" label="Description" defaultValue={item.description} multiline rows={2} />
                <Field name="icon" label="Icon key" defaultValue={item.icon} />
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
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveServiceCategory} deleteAction={deleteServiceCategory} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add specialty category</h2>
        <form action={addServiceCategory} className="space-y-3">
          <TranslatableInput name="title" label="Title" />
          <TranslatableInput name="description" label="Description" multiline rows={2} />
          <Field name="icon" label="Icon key" placeholder="brain" />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add category
          </button>
        </form>
      </div>
    </div>
  );
}
