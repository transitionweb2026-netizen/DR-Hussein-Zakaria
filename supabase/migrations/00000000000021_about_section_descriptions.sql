-- The new About Doctor page spec explicitly requires a section heading
-- AND description for Career Timeline, Certificates, and Main Specialties
-- -- these three existing About section-heading singletons only had
-- eyebrow/heading. Additive, defaulted -- no existing data affected.

alter table public.about_timeline_section
  add column description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description));

alter table public.about_certificates_section
  add column description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description));

alter table public.about_specialties_section
  add column description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description));
