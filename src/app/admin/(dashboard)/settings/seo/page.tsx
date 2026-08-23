import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getAllPageSeo, getSiteSettings } from "@/lib/data/global-settings";
import { updatePageSeo, updatePageSeoImage, updateSiteSeoSettings } from "./actions";

const CHANGE_FREQUENCIES = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const;

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
  const [rows, settings] = await Promise.all([getAllPageSeo(), getSiteSettings()]);

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="SEO"
        description="Search title, meta description, canonical URL, and indexing per page. Any page left blank falls back to the site-wide default."
      />

      <div className="mb-6 rounded-xl border border-admin-border bg-admin-surface p-4">
        <h2 className="mb-1 text-sm font-semibold text-admin-text">Site-wide SEO</h2>
        <p className="mb-4 text-xs text-admin-muted">
          Applies across every page rather than one at a time.
        </p>
        <AdminForm action={updateSiteSeoSettings}>
          <TranslatableInput
            name="medical_specialty"
            label="Medical specialty"
            defaultValue={settings?.medical_specialty}
          />
          <p className="-mt-3 text-xs text-admin-muted">
            Used in the site&apos;s structured data (the Physician entry search engines read), shown on every page.
          </p>

          <div className="rounded-lg border border-admin-danger/30 bg-admin-danger/5 p-3">
            <label className="flex items-start gap-2.5 text-sm font-medium text-admin-text">
              <input
                type="checkbox"
                name="block_all_indexing"
                defaultChecked={settings?.block_all_indexing ?? false}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-admin-border"
              />
              <span>
                Block ALL search engines from indexing this site
                <span className="mt-1 block text-xs font-normal text-admin-muted">
                  For staging/maintenance only. When on, every page is marked noindex, the sitemap goes empty, and
                  robots.txt disallows everything. This overrides every individual page&apos;s Robots setting below.
                </span>
              </span>
            </label>
          </div>
        </AdminForm>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <details key={row.page_key} className="rounded-xl border border-admin-border bg-admin-surface p-4" open={row.page_key === "default"}>
            <summary className="cursor-pointer text-sm font-semibold text-admin-text">
              {PAGE_LABELS[row.page_key] ?? row.page_key}
            </summary>
            <div className="mt-4">
              <MediaUploadField
                label="Social share image (OG image)"
                currentUrl={row.og_image_url}
                action={updatePageSeoImage}
                hiddenFields={{ page_key: row.page_key }}
              />
            </div>
            <form action={updatePageSeo} className="mt-4 space-y-4">
              <input type="hidden" name="page_key" value={row.page_key} />
              <TranslatableInput name="seo_title" label="SEO title" defaultValue={row.seo_title} />
              <TranslatableInput name="meta_description" label="Meta description" defaultValue={row.meta_description} multiline rows={2} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Field name="canonical_url" label="Canonical URL (optional)" defaultValue={row.canonical_url ?? ""} dir="ltr" />
                  <p className="mt-1 text-xs text-admin-muted">
                    Leave blank (recommended) -- English and Arabic each automatically canonicalize to their own URL. Only fill this in to force BOTH language versions of this page to one exact URL instead.
                  </p>
                </div>
                <Field name="robots" label="Robots (e.g. index,follow or noindex,nofollow)" defaultValue={row.robots} dir="ltr" />
              </div>

              {row.page_key !== "default" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`sitemap_priority_${row.page_key}`} className="mb-1.5 block text-sm font-medium text-admin-text">
                      Sitemap priority
                    </label>
                    <input
                      id={`sitemap_priority_${row.page_key}`}
                      name="sitemap_priority"
                      type="number"
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={row.sitemap_priority}
                      className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                    />
                    <p className="mt-1 text-xs text-admin-muted">0.0-1.0 -- relative importance vs. this site&apos;s other pages.</p>
                  </div>
                  <div>
                    <label htmlFor={`sitemap_change_frequency_${row.page_key}`} className="mb-1.5 block text-sm font-medium text-admin-text">
                      Sitemap change frequency
                    </label>
                    <select
                      id={`sitemap_change_frequency_${row.page_key}`}
                      name="sitemap_change_frequency"
                      defaultValue={row.sitemap_change_frequency}
                      className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                    >
                      {CHANGE_FREQUENCIES.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

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
