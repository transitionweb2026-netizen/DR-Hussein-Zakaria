-- about_page_content's hero was missing its own CTA button label (Home's
-- hero has cta_primary_label; every other non-Home hero either reuses an
-- adjacent field the original static site already reused, or -- as here --
-- genuinely needs its own dedicated field so the button text isn't stuck
-- borrowing an ill-fitting label). Additive, nullable-safe default.

alter table public.about_page_content
  add column hero_cta_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_cta_label));
