-- Expose everything the SEO implementation currently hardcodes in code as
-- real CMS controls, reusing the existing site_settings and page_seo
-- tables (same singleton-row and per-page-row patterns already used
-- throughout this schema) -- no new tables, no separate SEO architecture.

-- site_settings: two additive columns.
-- medical_specialty backs the Physician JSON-LD's medicalSpecialty field
-- (src/app/[locale]/layout.tsx), previously hardcoded to "Neurosurgery".
-- block_all_indexing is a sitewide kill-switch previously not exposed
-- anywhere -- when on, it forces noindex on every page's meta robots tag,
-- empties the sitemap, and switches robots.txt to disallow everything.
alter table public.site_settings
  add column if not exists medical_specialty jsonb not null
    default '{"en":"Neurosurgery","ar":"جراحة المخ والأعصاب"}'::jsonb
    check (public.is_bilingual(medical_specialty)),
  add column if not exists block_all_indexing boolean not null default false;

-- page_seo: two additive columns per page, backing the sitemap's
-- <priority> and <changefreq> values (src/app/sitemap.ts), previously
-- hardcoded as static PRIORITY/CHANGE_FREQUENCY maps keyed by page_key.
alter table public.page_seo
  add column if not exists sitemap_priority numeric(2,1) not null default 0.7
    check (sitemap_priority >= 0 and sitemap_priority <= 1),
  add column if not exists sitemap_change_frequency text not null default 'monthly'
    check (sitemap_change_frequency in ('always','hourly','daily','weekly','monthly','yearly','never'));

-- Seed the exact values sitemap.ts previously hardcoded, so this migration
-- changes nothing about current production behavior on its own -- only the
-- admin's ability to edit these values going forward.
update public.page_seo set sitemap_priority = 1.0, sitemap_change_frequency = 'weekly'  where page_key = 'home';
update public.page_seo set sitemap_priority = 0.9, sitemap_change_frequency = 'monthly' where page_key = 'about';
update public.page_seo set sitemap_priority = 0.9, sitemap_change_frequency = 'monthly' where page_key = 'services';
update public.page_seo set sitemap_priority = 0.7, sitemap_change_frequency = 'monthly' where page_key = 'videos';
update public.page_seo set sitemap_priority = 0.7, sitemap_change_frequency = 'monthly' where page_key = 'patient-stories';
update public.page_seo set sitemap_priority = 0.7, sitemap_change_frequency = 'weekly'  where page_key = 'articles';
update public.page_seo set sitemap_priority = 0.8, sitemap_change_frequency = 'monthly' where page_key = 'contact';
