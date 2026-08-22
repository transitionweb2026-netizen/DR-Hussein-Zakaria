-- The header/mobile-menu "Book Appointment" button is sitewide chrome, not
-- a regular nav_items row (it always links to /contact and is styled as a
-- CTA, not a nav link) -- it didn't have a column anywhere. site_settings
-- is the right home for this kind of one-off sitewide label.

alter table public.site_settings
  add column book_appointment_label jsonb not null default '{"en":"Book Appointment","ar":"احجز موعد"}'::jsonb
    check (public.is_bilingual(book_appointment_label));
