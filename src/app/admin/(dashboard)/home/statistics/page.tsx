import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { ReorderDeleteControls } from "@/components/admin/reorder-delete-controls";
import { getHomeStatsSection, getAllHomeStats } from "@/lib/data/home";
import { updateStatsSection, addStat, updateStat, deleteStat, moveStat } from "./actions";

export default async function HomeStatisticsPage() {
  const [section, stats] = await Promise.all([getHomeStatsSection(), getAllHomeStats()]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Home — Statistics" description="The animated counters section. Only published stats appear on the live site." />

      <AdminForm action={updateStatsSection} saveLabel="Save heading">
        <TranslatableInput name="eyebrow" label="Eyebrow" defaultValue={section?.eyebrow} />
        <TranslatableInput name="heading" label="Heading" defaultValue={section?.heading} />
        <TranslatableInput name="description" label="Supporting text (optional)" defaultValue={section?.description} multiline rows={2} />
      </AdminForm>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Statistics</h2>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={stat.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
              <form action={updateStat} className="space-y-3">
                <input type="hidden" name="id" value={stat.id} />
                <TranslatableInput name="label" label="Label" defaultValue={stat.label} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field name="value" label="Number" type="number" defaultValue={stat.value} />
                  <Field name="suffix" label="Suffix (e.g. +, %)" defaultValue={stat.suffix} />
                  <Field name="icon" label="Icon key" defaultValue={stat.icon} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-admin-text">
                    <input type="checkbox" name="published" defaultChecked={stat.status === "published"} className="h-4 w-4 rounded" />
                    Published
                  </label>
                  <button type="submit" className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
                    Save
                  </button>
                </div>
              </form>
              <ReorderDeleteControls id={stat.id} isFirst={i === 0} isLast={i === stats.length - 1} moveAction={moveStat} deleteAction={deleteStat} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add statistic</h2>
        <form action={addStat} className="space-y-3">
          <TranslatableInput name="label" label="Label" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field name="value" label="Number" type="number" placeholder="10" />
            <Field name="suffix" label="Suffix" placeholder="+" />
            <Field name="icon" label="Icon key" placeholder="users" />
          </div>
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover">
            <Plus className="h-3.5 w-3.5" />
            Add statistic
          </button>
        </form>
      </div>
    </div>
  );
}
