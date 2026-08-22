import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getAboutPageContent, getAllAboutEducation } from "@/lib/data/about";
import { updateEducationHeading, addEducation, updateEducation, deleteEducation, moveEducation } from "./actions";

export default async function AboutEducationPage() {
  const [content, items] = await Promise.all([getAboutPageContent(), getAllAboutEducation()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="About Doctor — Education" description="Degrees and institutions listed on the /about page." />

      <AdminForm action={updateEducationHeading} saveLabel="Save heading">
        <TranslatableInput name="education_heading" label="Section heading" defaultValue={content?.education_heading} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Education entries</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <form action={updateEducation} className="space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <TranslatableInput name="degree" label="Degree" defaultValue={item.degree} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
                  <TranslatableInput name="institution" label="Institution" defaultValue={item.institution} />
                  <Field name="year" label="Year" defaultValue={item.year} />
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
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveEducation} deleteAction={deleteEducation} />
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-admin-muted">No education entries yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add education entry</h2>
        <form action={addEducation} className="space-y-3">
          <TranslatableInput name="degree" label="Degree" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
            <TranslatableInput name="institution" label="Institution" />
            <Field name="year" label="Year" placeholder="2008" />
          </div>
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add entry
          </button>
        </form>
      </div>
    </div>
  );
}
