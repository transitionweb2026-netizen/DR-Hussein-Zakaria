import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeWhyChooseSection, getAllWhyChooseReasons } from "@/lib/data/home";
import { updateWhyChooseSection, updateWhyChooseImage, addReason, updateReason, deleteReason, moveReason } from "./actions";

export default async function HomeWhyChoosePage() {
  const [section, reasons] = await Promise.all([getHomeWhyChooseSection(), getAllWhyChooseReasons()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Home — Why Dr. Hussein Zakaria" description="The reasons/benefits section, sixth on the homepage." />

      <MediaUploadField label="Doctor image" currentUrl={section?.image_url ?? null} action={updateWhyChooseImage} size={100} />

      <AdminForm action={updateWhyChooseSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="heading_prefix" label="Heading (first part)" defaultValue={section?.heading_prefix} />
          <TranslatableInput name="heading_highlight" label="Heading (highlighted part)" defaultValue={section?.heading_highlight} />
        </div>
        <TranslatableInput name="description" label="Description" defaultValue={section?.description} multiline rows={2} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Reasons</h2>
        <div className="space-y-3">
          {reasons.map((reason, i) => (
            <div key={reason.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <form action={updateReason} className="space-y-3">
                <input type="hidden" name="id" value={reason.id} />
                <TranslatableInput name="title" label="Reason title" defaultValue={reason.title} />
                <TranslatableInput name="description" label="Reason description" defaultValue={reason.description} multiline rows={2} />
                <Field name="icon" label="Icon key" defaultValue={reason.icon} />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-admin-text">
                    <input type="checkbox" name="published" defaultChecked={reason.status === "published"} className="h-4 w-4 rounded" />
                    Published
                  </label>
                  <button type="submit" className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                    Save
                  </button>
                </div>
              </form>
              <ReorderDeleteControls id={reason.id} isFirst={i === 0} isLast={i === reasons.length - 1} moveAction={moveReason} deleteAction={deleteReason} />
            </div>
          ))}
          {reasons.length === 0 && <p className="text-sm text-admin-muted">No reasons yet.</p>}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add reason</h2>
        <form action={addReason} className="space-y-3">
          <TranslatableInput name="title" label="Reason title" />
          <TranslatableInput name="description" label="Reason description" multiline rows={2} />
          <Field name="icon" label="Icon key" placeholder="cpu" />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add reason
          </button>
        </form>
      </div>
    </div>
  );
}
