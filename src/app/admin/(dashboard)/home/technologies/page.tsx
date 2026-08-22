import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeTechnologiesSection, getAllTechnologies } from "@/lib/data/home";
import { updateTechnologiesSection, addTechnology, updateTechnology, deleteTechnology, moveTechnology, updateTechnologyImage } from "./actions";

export default async function HomeTechnologiesPage() {
  const [section, items] = await Promise.all([getHomeTechnologiesSection(), getAllTechnologies()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Home — Technologies" description="The technologies/equipment showcase section, fifth on the homepage." />

      <AdminForm action={updateTechnologiesSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={section?.description} multiline rows={2} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Technologies</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <MediaUploadField
                label="Image"
                currentUrl={item.image_url}
                action={updateTechnologyImage}
                hiddenFields={{ id: item.id }}
                size={64}
              />
              <form action={updateTechnology} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="name" label="Technology name" defaultValue={item.name} />
                <TranslatableInput name="description" label="Description" defaultValue={item.description} multiline rows={2} />
                <Field name="icon" label="Icon key (fallback if no image)" defaultValue={item.icon} />
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
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveTechnology} deleteAction={deleteTechnology} />
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No technologies yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add technology</h2>
        <form action={addTechnology} className="space-y-3">
          <TranslatableInput name="name" label="Technology name" />
          <TranslatableInput name="description" label="Description" multiline rows={2} />
          <Field name="icon" label="Icon key" placeholder="cpu" />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add technology
          </button>
        </form>
      </div>
    </div>
  );
}
