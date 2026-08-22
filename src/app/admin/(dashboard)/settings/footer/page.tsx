import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { getFooterContent } from "@/lib/data/global-settings";
import { updateFooterContent } from "./actions";

export default async function FooterSettingsPage() {
  const footer = await getFooterContent();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Footer"
        description="Contact details, quick links, and services shown in the footer come from their own sections (Contact Info, Navigation, Services) -- this page is just the footer's own wording."
      />
      <AdminForm action={updateFooterContent}>
        <TranslatableInput name="description" label="Description" defaultValue={footer?.description} multiline rows={3} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TranslatableInput name="quick_links_title" label='"Quick Links" column title' defaultValue={footer?.quick_links_title} />
          <TranslatableInput name="services_title" label='"Services" column title' defaultValue={footer?.services_title} />
          <TranslatableInput name="contact_title" label='"Contact" column title' defaultValue={footer?.contact_title} />
        </div>
        <TranslatableInput name="hours_title" label='"Working Hours" column title' defaultValue={footer?.hours_title} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TranslatableInput name="weekdays_label" label="Weekdays label" defaultValue={footer?.weekdays_label} />
          <TranslatableInput name="weekday_hours" label="Weekday hours" defaultValue={footer?.weekday_hours} />
          <TranslatableInput name="weekend_label" label="Weekend label" defaultValue={footer?.weekend_label} />
          <TranslatableInput name="weekend_status" label="Weekend status" defaultValue={footer?.weekend_status} />
        </div>
        <TranslatableInput
          name="copyright"
          label="Copyright text (use {year} for the current year)"
          defaultValue={footer?.copyright}
        />
      </AdminForm>
    </div>
  );
}
