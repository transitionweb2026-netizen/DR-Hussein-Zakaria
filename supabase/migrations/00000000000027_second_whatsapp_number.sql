-- A second WhatsApp number, shown as an extra option everywhere a
-- WhatsApp button already exists sitewide. Empty by default (not null,
-- matching whatsapp_number's own convention) -- every consumer falls
-- back to a single plain link, today's exact behavior, when this is
-- blank.
alter table public.site_settings
  add column if not exists whatsapp_number_2 text not null default '';

update public.site_settings set whatsapp_number_2 = '201002036223'
  where id = '00000000-0000-0000-0000-000000000001';
