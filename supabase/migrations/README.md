# Database migrations

These 12 files, run in order, create the entire CMS schema: every content
table, the `media` library table + Storage bucket, and RLS policies on
everything. They were written and reviewed without a live database
connection (no Docker in this environment) — run the checklist below once
you have a real Supabase project to actually verify them.

## One-time setup (once you have a Supabase project)

1. Create a project at [supabase.com](https://supabase.com) (the free tier
   is enough for this site).
2. From the project's **Settings → API** page, copy the **Project URL**,
   **anon/public key**, and **service_role key**.
3. Copy `.env.example` to `.env.local` and fill in the three values above.
4. Link this repo to the project and push the migrations:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   (Alternatively: open the Supabase Dashboard's SQL Editor and paste each
   file's contents in order, `00000000000001_...` through
   `00000000000012_...`.)
5. **Bootstrap the first admin account** — deliberately done by hand, not by
   a script, so the service-role key never needs to be used at all:
   - Dashboard → **Authentication → Users → Add user** (email + password).
   - Copy the new user's UUID.
   - Dashboard → **SQL Editor**, run:
     ```sql
     insert into public.admin_users (id, email) values ('<uuid-you-copied>', '<their-email>');
     ```
   - That account can now log in at `/admin/login`.

## What's in each file

| File | Creates |
|---|---|
| `...0001_extensions_and_helpers.sql` | `content_status` enum, `is_bilingual()` check helper, `set_updated_at()` trigger function |
| `...0002_admin_users.sql` | `admin_users`, `is_admin()` (the function every later RLS policy calls) |
| `...0003_media.sql` | `media` table, the `media` Storage bucket, bucket RLS policies |
| `...0004_global_settings.sql` | `site_settings`, `social_links`, `nav_items`, `page_seo`, `final_cta_content`, `contact_submissions` |
| `...0005_shared_content.sql` | `career_timeline`, `certificates`, `service_categories` — shared between Home and the About page |
| `...0006_home_page.sql` | Every Home-page content table |
| `...0007_about_page.sql` | The new `/about` page's content tables |
| `...0008_services.sql` | `services_page_content`, `surgeries` (FK to `service_categories`), `surgery_images` |
| `...0009_videos.sql` | `videos_page_content`, `videos` |
| `...0010_patient_stories_reviews.sql` | `patient_stories_page_content`, `patient_stories`, `reviews` |
| `...0011_articles.sql` | `articles_page_content`, `articles` |
| `...0012_contact.sql` | `contact_page_content` |
| `...0013_footer_content.sql` | `footer_content` -- description, column titles, working hours, copyright (a gap the initial table list missed) |
| `...0014_nav_button_label.sql` | Adds `site_settings.book_appointment_label` -- the header/mobile-menu CTA button text (another small gap) |

## Schema conventions

- **Bilingual text** is `jsonb` shaped `{"en": "...", "ar": "..."}`, checked
  (both keys present, not that they're non-empty) by `is_bilingual()`.
  Numbers/URLs/slugs/icon-keys/booleans/media references are plain columns.
- **Singleton content blocks** (page heroes, section headings, `site_settings`,
  etc.) use a fixed row id (`00000000-0000-0000-0000-000000000001`) seeded
  by the migration itself and only ever `UPDATE`d by the app — never
  `INSERT`ed into again.
- **Repeatable content** (stats, timeline, certificates, surgeries, videos,
  stories, reviews, articles, nav items, social links) gets `sort_order` and
  a `status` (`'draft'` / `'published'`) column.
- **RLS**, on every table: public (`anon`) can read only `status = 'published'`
  rows (or `is_active = true` for nav/social, or unconditionally for
  singleton/metadata tables); a logged-in admin (checked via `is_admin()`)
  can read everything and write; `contact_submissions` is the one inverted
  case — anyone can `INSERT`, only admins can `SELECT`.
