import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Field } from "@/components/admin/field";
import { getAllSocialLinks } from "@/lib/data/global-settings";
import { addSocialLink, updateSocialLink, deleteSocialLink, moveSocialLink } from "./actions";

export default async function SocialSettingsPage() {
  const items = await getAllSocialLinks();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Social Media"
        description="Every social icon across the site (header, hero, footer, contact page) reads from this list. Previously every icon linked to a placeholder -- this is what gives them real destinations."
      />

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-admin-border bg-admin-surface p-4">
            <form action={updateSocialLink} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field name="platform" label="Platform" defaultValue={item.platform} />
                <Field name="icon" label="Icon key" defaultValue={item.icon} />
                <Field name="url" label="URL" defaultValue={item.url} dir="ltr" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-admin-text">
                  <input type="checkbox" name="is_active" defaultChecked={item.is_active} className="h-4 w-4 rounded" />
                  Active
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover"
                >
                  Save
                </button>
              </div>
            </form>
            <div className="mt-3 flex items-center gap-1.5 border-t border-admin-border pt-3">
              <form action={moveSocialLink}>
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
              <form action={moveSocialLink}>
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
              <form action={deleteSocialLink} className="ms-auto">
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
        <h2 className="mb-3 text-sm font-semibold text-admin-text">Add social link</h2>
        <form action={addSocialLink} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field name="platform" label="Platform" placeholder="Facebook" />
            <Field name="icon" label="Icon key" placeholder="facebook" />
            <Field name="url" label="URL" placeholder="https://facebook.com/..." dir="ltr" />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Add link
          </button>
        </form>
      </div>
    </div>
  );
}
