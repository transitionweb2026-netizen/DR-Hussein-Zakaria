import { PageHeader } from "@/components/admin/page-header";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { getAllPageSeo } from "@/lib/data/global-settings";
import { updatePageSeo } from "./actions";

const PAGE_LABELS: Record<string, string> = {
  default: "Site-wide default (fallback)",
  home: "Home",
  about: "About Doctor",
  services: "Services",
  videos: "Videos",
  "patient-stories": "Patient Stories",
  articles: "Articles",
  contact: "Contact Us",
};

export default async function SeoSettingsPage() {
  const rows = await getAllPageSeo();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="SEO"
        description="Search title, meta description, canonical URL, and indexing per page. Any page left blank falls back to the site-wide default."
      />
      <div className="space-y-3">
        {rows.map((row) => (
          <details key={row.page_key} className="rounded-xl border border-admin-border bg-admin-surface p-4" open={row.page_key === "default"}>
            <summary className="cursor-pointer text-sm font-semibold text-admin-text">
              {PAGE_LABELS[row.page_key] ?? row.page_key}
            </summary>
            <form action={updatePageSeo} className="mt-4 space-y-4">
              <input type="hidden" name="page_key" value={row.page_key} />
              <TranslatableInput name="seo_title" label="SEO title" defaultValue={row.seo_title} />
              <TranslatableInput name="meta_description" label="Meta description" defaultValue={row.meta_description} multiline rows={2} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field name="canonical_url" label="Canonical URL (optional)" defaultValue={row.canonical_url ?? ""} dir="ltr" />
                <Field name="robots" label="Robots" defaultValue={row.robots} dir="ltr" />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-admin-accent-hover"
              >
                Save
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}
