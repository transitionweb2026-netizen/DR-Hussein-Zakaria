-- The Videos page Hero's primary CTA button and the Featured Videos
-- section's own <h2> heading were both reading intro_heading -- editing
-- one silently changed the other. New, independent field for the button;
-- intro_heading goes back to being only the section heading.
alter table public.videos_page_content
  add column if not exists hero_cta_label jsonb not null
    default '{"en":"","ar":""}'::jsonb
    check (public.is_bilingual(hero_cta_label));

-- Seed it with the value the button currently shows, so nothing changes
-- visually the moment this runs -- both fields keep showing what's
-- currently on screen until edited independently going forward.
update public.videos_page_content set hero_cta_label = intro_heading;
