import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getAllNavItems, getSiteSettings } from "@/lib/data/global-settings";
import { addNavItem, updateNavItem, deleteNavItem, moveNavItem, updateBookAppointmentLabel } from "./actions";

export default async function NavigationSettingsPage() {
  const [items, settings] = await Promise.all([getAllNavItems(), getSiteSettings()]);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Navigation"
        description="Header nav and the footer's Quick Links column both read from this one list -- relabel or reorder once, updates everywhere."
      />

      <div className="mb-8 rounded-xl border border-admin-border bg-admin-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">&quot;Book Appointment&quot; button</h2>
        <AdminForm action={updateBookAppointmentLabel} saveLabel="Save">
          <TranslatableInput name="book_appointment_label" label="Button label" defaultValue={settings?.book_appointment_label} />
        </AdminForm>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
            <form action={updateNavItem} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
                <TranslatableInput name="label" label="Label" defaultValue={item.label} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-admin-text">Link (href)</label>
                  <input
                    name="href"
                    defaultValue={item.href}
                    dir="ltr"
                    className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-admin-text">
                  <input type="checkbox" name="is_active" defaultChecked={item.is_active} className="h-4 w-4 rounded" />
                  Active
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 flex items-center gap-1.5 border-t border-admin-border pt-3">
              <form action={moveNavItem}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={i === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-admin-border text-admin-muted hover:bg-admin-bg disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </form>
              <form action={moveNavItem}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={i === items.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-admin-border text-admin-muted hover:bg-admin-bg disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </form>
              <form action={deleteNavItem} className="ms-auto">
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-admin-border text-admin-danger hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-admin-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add nav item</h2>
        <form action={addNavItem} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <TranslatableInput name="label" label="Label" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">Link (href)</label>
              <input
                name="href"
                dir="ltr"
                placeholder="/about"
                className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Add item
          </button>
        </form>
      </div>
    </div>
  );
}
