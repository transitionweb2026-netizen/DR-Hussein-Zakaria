import { PageHeader } from "@/components/admin/page-header";
import { AdminForm } from "@/components/admin/admin-form";
import { TranslatableInput } from "@/components/admin/translatable-input";
import { Field } from "@/components/admin/field";
import { getSiteSettings } from "@/lib/data/global-settings";
import { updateContactInfo } from "./actions";

export default async function ContactInfoSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Contact Information"
        description="The single source of truth for phone, WhatsApp, email, and address -- every page and button that shows contact details reads from here, so there's never a second place to forget to update."
      />
      <AdminForm action={updateContactInfo}>
        <Field name="phone" label="Phone number" defaultValue={settings?.phone} placeholder="+20 123 456 7890" required />
        <Field
          name="whatsapp_number"
          label="WhatsApp number (digits only, with country code)"
          defaultValue={settings?.whatsapp_number}
          placeholder="201234567890"
          required
        />
        <Field name="email" label="Email address" type="email" defaultValue={settings?.email} required />
        <TranslatableInput name="address" label="Address" defaultValue={settings?.address} />
      </AdminForm>
    </div>
  );
}
