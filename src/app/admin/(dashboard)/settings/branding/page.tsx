import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { getSiteSettings } from "@/lib/data/global-settings";
import { updateBrandingText, updateLogo, updateFavicon } from "./actions";

export default async function BrandingSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Branding" description="Site name, tagline, logo, and favicon -- used in the header, footer, and browser tab across every page." />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MediaUploadField label="Logo" currentUrl={settings?.logo_url ?? null} action={updateLogo} />
        <MediaUploadField label="Favicon" currentUrl={settings?.favicon_url ?? null} action={updateFavicon} />
      </div>

      <AdminForm action={updateBrandingText}>
        <TranslatableInput name="site_name" label="Site name" defaultValue={settings?.site_name} required />
        <TranslatableInput name="tagline" label="Tagline" defaultValue={settings?.tagline} />
      </AdminForm>
    </div>
  );
}
