import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeTimelineSection } from "@/lib/data/home";
import { getAllCareerTimeline } from "@/lib/data/shared-content";
import { updateTimelineSection, addTimelineItem, updateTimelineItem, deleteTimelineItem, moveTimelineItem } from "./actions";

export default async function HomeTimelinePage() {
  const [section, items] = await Promise.all([getHomeTimelineSection(), getAllCareerTimeline()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Home — Career Timeline"
        description="Shared with the About Doctor page's Career section -- edited once here, reflected in both places."
      />

      <AdminForm action={updateTimelineSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Milestones</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <form action={updateTimelineItem} className="space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
                  <Field name="year" label="Year" defaultValue={item.year} />
                  <Field name="icon" label="Icon key" defaultValue={item.icon} />
                </div>
                <TranslatableInput name="title" label="Title" defaultValue={item.title} />
                <TranslatableInput name="description" label="Description" defaultValue={item.description} multiline rows={2} />
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
              <ReorderDeleteControls id={item.id} isFirst={i === 0} isLast={i === items.length - 1} moveAction={moveTimelineItem} deleteAction={deleteTimelineItem} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add milestone</h2>
        <form action={addTimelineItem} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
            <Field name="year" label="Year" placeholder="2018" />
            <Field name="icon" label="Icon key" placeholder="graduation-cap" />
          </div>
          <TranslatableInput name="title" label="Title" />
          <TranslatableInput name="description" label="Description" multiline rows={2} />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add milestone
          </button>
        </form>
      </div>
    </div>
  );
}
