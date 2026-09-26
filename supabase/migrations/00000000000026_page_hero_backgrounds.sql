-- Per-page Hero background images. Every page's Hero (About, Services,
-- Videos, Patient Stories, Articles, Contact) currently falls back to
-- Global Settings -> Branding's one sitewide default_hero_bg_media_id,
-- with no way to set a different image per page -- only Home has its own
-- (home_hero.background_media_id, already existed). Additive column on
-- each remaining page's content table; null means "keep using the
-- sitewide default", exactly matching current behavior, so this changes
-- nothing on its own.
alter table public.about_page_content
  add column if not exists hero_background_media_id uuid references public.media (id) on delete set null;

alter table public.services_page_content
  add column if not exists hero_background_media_id uuid references public.media (id) on delete set null;

alter table public.videos_page_content
  add column if not exists hero_background_media_id uuid references public.media (id) on delete set null;

alter table public.patient_stories_page_content
  add column if not exists hero_background_media_id uuid references public.media (id) on delete set null;

alter table public.articles_page_content
  add column if not exists hero_background_media_id uuid references public.media (id) on delete set null;

alter table public.contact_page_content
  add column if not exists hero_background_media_id uuid references public.media (id) on delete set null;
