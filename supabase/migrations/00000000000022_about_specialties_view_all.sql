-- Main Specialties section (About Doctor page) needs a "View All Services"
-- button per the new spec, matching the label pattern already used by
-- home_specialties_section.view_all_label. Destination is a fixed
-- /services route (consistent with every other "View All X" button on the
-- site -- only the label is CMS text). Additive, defaulted.

alter table public.about_specialties_section
  add column view_all_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(view_all_label));
