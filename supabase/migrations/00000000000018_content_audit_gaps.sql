-- Two gaps found during a full re-audit of actual rendered page content
-- (not just the original spec): the surgery detail modal's "Symptoms"/
-- "Treatment" sub-headings were hardcoded English-only strings with no
-- Arabic translation and no CMS control, and the About page's Biography
-- block had no section eyebrow/heading at all (broke the otherwise
-- consistent Section > Heading > Content pattern used everywhere else on
-- the site). Additive, defaulted -- no existing data affected.

alter table public.services_page_content
  add column symptoms_label jsonb not null default '{"en":"Symptoms","ar":"الأعراض"}'::jsonb check (public.is_bilingual(symptoms_label)),
  add column treatment_label jsonb not null default '{"en":"Treatment","ar":"العلاج"}'::jsonb check (public.is_bilingual(treatment_label));

alter table public.about_page_content
  add column biography_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(biography_eyebrow)),
  add column biography_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(biography_heading));
