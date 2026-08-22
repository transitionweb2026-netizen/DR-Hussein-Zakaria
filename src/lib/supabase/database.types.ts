/**
 * Hand-authored to match supabase/migrations/*.sql exactly, since this
 * environment has no live Supabase project yet to generate types from.
 *
 * Once linked to a real project, regenerate the real thing with:
 *   npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts
 * That command's output supersedes this file -- diff before overwriting in
 * case any hand-written helper types below (Bilingual, Json, etc.) are
 * still depended on elsewhere.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/** Every translatable text field is stored as {"en": "...", "ar": "..."}. */
export type Bilingual = { en: string; ar: string };

export type ContentStatus = "draft" | "published";

type Timestamps = { created_at: string; updated_at: string };
type Repeatable = { sort_order: number; status: ContentStatus } & Timestamps;

// Row = the shape returned by a SELECT. Insert/Update are derived (rather
// than hand-duplicated per table) to match real Postgres/Supabase insert
// semantics: nullable columns and generated columns (id/created_at/
// updated_at, which all have DB defaults) are optional on Insert; every
// other column is required. `Relationships` is required (as an empty
// tuple -- this file doesn't model FK embeds, see
// src/lib/data/resolve-media.ts for why) to satisfy @supabase/postgrest-
// js's GenericTable constraint; omitting it silently collapses every Row/
// Insert/Update type to `never` instead of erroring clearly.
type NullableKeys<Row> = { [K in keyof Row]: null extends Row[K] ? K : never }[keyof Row];
type GeneratedOnInsert = "id" | "created_at" | "updated_at";

type Derive<Row, ExtraOptional extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Exclude<keyof Row, NullableKeys<Row> | GeneratedOnInsert | ExtraOptional>>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      admin_users: Derive<{ id: string; email: string; role: string; created_at: string }>;

      media: Derive<{
        id: string;
        bucket: string;
        path: string;
        folder: string;
        filename: string;
        mime_type: string;
        size_bytes: number;
        width: number | null;
        height: number | null;
        alt_text: Bilingual;
        uploaded_by: string | null;
        created_at: string;
      }>;

      site_settings: Derive<{
        id: string;
        site_name: Bilingual;
        tagline: Bilingual;
        logo_media_id: string | null;
        favicon_media_id: string | null;
        default_hero_bg_media_id: string | null;
        phone: string;
        whatsapp_number: string;
        email: string;
        address: Bilingual;
        book_appointment_label: Bilingual;
        updated_at: string;
      }>;

      social_links: Derive<
        { id: string; platform: string; url: string; icon: string; is_active: boolean } & { sort_order: number } & Timestamps
      >;

      nav_items: Derive<
        { id: string; label: Bilingual; href: string; is_active: boolean } & { sort_order: number } & Timestamps
      >;

      page_seo: Derive<{
        id: string;
        page_key: string;
        seo_title: Bilingual;
        meta_description: Bilingual;
        og_image_media_id: string | null;
        canonical_url: string | null;
        robots: string;
        updated_at: string;
      }>;

      final_cta_content: Derive<{
        id: string;
        title: Bilingual;
        subtitle: Bilingual;
        whatsapp_label: Bilingual;
        call_label: Bilingual;
        updated_at: string;
      }>;

      contact_submissions: Derive<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        message: string;
        status: "new" | "read" | "archived";
        created_at: string;
      }>;

      career_timeline: Derive<
        { id: string; year: string; title: Bilingual; description: Bilingual; icon: string } & Repeatable
      >;

      certificates: Derive<
        { id: string; title: Bilingual; issuer: Bilingual; year: string; image_media_id: string | null } & Repeatable
      >;

      service_categories: Derive<
        {
          id: string;
          slug: string;
          title: Bilingual;
          description: Bilingual;
          icon: string;
          image_media_id: string | null;
        } & Repeatable
      >;

      home_hero: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading_prefix: Bilingual;
        heading_highlight: Bilingual;
        paragraph: Bilingual;
        cta_primary_label: Bilingual;
        cta_secondary_label: Bilingual;
        phone_label: Bilingual;
        social_label: Bilingual;
        background_media_id: string | null;
        updated_at: string;
      }>;

      home_about: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading_prefix: Bilingual;
        heading_highlight: Bilingual;
        paragraph_1: Bilingual;
        paragraph_2: Bilingual;
        doctor_name: Bilingual;
        doctor_title: Bilingual;
        cta_label: Bilingual;
        doctor_image_media_id: string | null;
        updated_at: string;
      }>;

      home_video_intro: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        duration: string;
        thumbnail_media_id: string | null;
        video_url: string | null;
        video_provider: "youtube" | "vimeo" | "mp4" | null;
        updated_at: string;
      }>;

      home_stats_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; description: Bilingual; updated_at: string }>;
      home_stats: Derive<
        { id: string; label: Bilingual; value: number; suffix: string; icon: string } & Repeatable
      >;

      home_timeline_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; updated_at: string }>;
      home_certificates_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; description: Bilingual; updated_at: string }>;
      home_specialties_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        view_all_label: Bilingual;
        updated_at: string;
      }>;

      home_technologies_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        updated_at: string;
      }>;

      technologies: Derive<
        { id: string; name: Bilingual; description: Bilingual; icon: string; image_media_id: string | null } & Repeatable
      >;

      home_why_choose_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading_prefix: Bilingual;
        heading_highlight: Bilingual;
        description: Bilingual;
        image_media_id: string | null;
        updated_at: string;
      }>;

      why_choose_reasons: Derive<
        { id: string; title: Bilingual; description: Bilingual; icon: string } & Repeatable
      >;

      home_reviews_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        view_all_label: Bilingual;
        updated_at: string;
      }>;

      home_videos_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        view_all_label: Bilingual;
        updated_at: string;
      }>;

      home_articles_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        view_all_label: Bilingual;
        updated_at: string;
      }>;

      home_faq_section: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        updated_at: string;
      }>;

      faqs: Derive<{ id: string; question: Bilingual; answer: Bilingual } & Repeatable>;

      home_doctor_message: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading_prefix: Bilingual;
        heading_highlight: Bilingual;
        quote: Bilingual;
        signature_name: Bilingual;
        signature_title: Bilingual;
        portrait_image_media_id: string | null;
        updated_at: string;
      }>;

      about_page_content: Derive<{
        id: string;
        hero_eyebrow: Bilingual;
        hero_heading_prefix: Bilingual;
        hero_heading_highlight: Bilingual;
        hero_paragraph: Bilingual;
        hero_cta_label: Bilingual;
        biography_eyebrow: Bilingual;
        biography_heading: Bilingual;
        biography: Bilingual;
        doctor_image_media_id: string | null;
        education_heading: Bilingual;
        cta_title: Bilingual;
        cta_subtitle: Bilingual;
        updated_at: string;
      }>;

      about_education: Derive<
        { id: string; degree: Bilingual; institution: Bilingual; year: string } & Repeatable
      >;

      about_video_intro: Derive<{
        id: string;
        eyebrow: Bilingual;
        heading: Bilingual;
        description: Bilingual;
        duration: string;
        thumbnail_media_id: string | null;
        video_url: string | null;
        video_provider: "youtube" | "vimeo" | "mp4" | null;
        updated_at: string;
      }>;

      about_stats_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; description: Bilingual; updated_at: string }>;

      about_timeline_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; description: Bilingual; updated_at: string }>;
      about_certificates_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; description: Bilingual; updated_at: string }>;
      about_specialties_section: Derive<{ id: string; eyebrow: Bilingual; heading: Bilingual; description: Bilingual; view_all_label: Bilingual; updated_at: string }>;

      services_page_content: Derive<{
        id: string;
        hero_eyebrow: Bilingual;
        hero_heading_prefix: Bilingual;
        hero_heading_highlight: Bilingual;
        hero_paragraph: Bilingual;
        intro_eyebrow: Bilingual;
        intro_heading: Bilingual;
        intro_paragraph: Bilingual;
        detailed_heading: Bilingual;
        view_procedures_label: Bilingual;
        symptoms_label: Bilingual;
        treatment_label: Bilingual;
        cta_title: Bilingual;
        cta_subtitle: Bilingual;
        updated_at: string;
      }>;

      surgeries: Derive<
        {
          id: string;
          category_id: string;
          slug: string;
          title: Bilingual;
          short_description: Bilingual;
          full_description: Bilingual;
          symptoms: Bilingual | null;
          treatment_info: Bilingual | null;
          faq: { question: Bilingual; answer: Bilingual }[] | null;
          video_url: string | null;
          video_provider: "youtube" | "vimeo" | "mp4" | null;
          primary_image_media_id: string | null;
        } & Repeatable
      >;

      surgery_images: Derive<{ id: string; surgery_id: string; media_id: string; sort_order: number }>;

      videos_page_content: Derive<{
        id: string;
        hero_eyebrow: Bilingual;
        hero_heading_prefix: Bilingual;
        hero_heading_highlight: Bilingual;
        hero_paragraph: Bilingual;
        intro_eyebrow: Bilingual;
        intro_heading: Bilingual;
        intro_description: Bilingual;
        updated_at: string;
      }>;

      videos: Derive<
        {
          id: string;
          title: Bilingual;
          description: Bilingual;
          duration: string;
          thumbnail_media_id: string | null;
          video_url: string | null;
          video_provider: "youtube" | "vimeo" | "mp4" | null;
        } & Repeatable
      >;

      patient_stories_page_content: Derive<{
        id: string;
        hero_eyebrow: Bilingual;
        hero_heading_prefix: Bilingual;
        hero_heading_highlight: Bilingual;
        hero_paragraph: Bilingual;
        intro_eyebrow: Bilingual;
        intro_heading: Bilingual;
        reviews_intro_eyebrow: Bilingual;
        reviews_intro_heading: Bilingual;
        read_story_label: Bilingual;
        label_condition: Bilingual;
        label_journey: Bilingual;
        label_outcome: Bilingual;
        updated_at: string;
      }>;

      patient_stories: Derive<
        {
          id: string;
          name: Bilingual;
          title: Bilingual;
          condition: Bilingual;
          journey: Bilingual;
          outcome: Bilingual;
          image_media_id: string | null;
        } & Repeatable
      >;

      reviews: Derive<
        {
          id: string;
          name: Bilingual;
          role: Bilingual;
          quote: Bilingual;
          rating: number;
          avatar_media_id: string | null;
          review_date: string | null;
          source: string | null;
        } & Repeatable
      >;

      articles_page_content: Derive<{
        id: string;
        hero_eyebrow: Bilingual;
        hero_heading_prefix: Bilingual;
        hero_heading_highlight: Bilingual;
        hero_paragraph: Bilingual;
        read_more_label: Bilingual;
        updated_at: string;
      }>;

      articles: Derive<
        {
          id: string;
          slug: string;
          category: Bilingual;
          title: Bilingual;
          excerpt: Bilingual;
          content: Bilingual;
          image_media_id: string | null;
          is_featured: boolean;
          published_date: string;
          author: Bilingual | null;
          reading_time: string | null;
          seo_title: Bilingual | null;
          seo_description: Bilingual | null;
        } & Repeatable
      >;

      contact_page_content: Derive<{
        id: string;
        hero_eyebrow: Bilingual;
        hero_heading_prefix: Bilingual;
        hero_heading_highlight: Bilingual;
        hero_paragraph: Bilingual;
        form_eyebrow: Bilingual;
        form_heading: Bilingual;
        form_name_label: Bilingual;
        form_name_placeholder: Bilingual;
        form_email_label: Bilingual;
        form_email_placeholder: Bilingual;
        form_phone_label: Bilingual;
        form_phone_placeholder: Bilingual;
        form_message_label: Bilingual;
        form_message_placeholder: Bilingual;
        form_submit_label: Bilingual;
        form_sending_label: Bilingual;
        form_success_message: Bilingual;
        form_or_label: Bilingual;
        map_label: Bilingual;
        map_embed_url: string | null;
        updated_at: string;
      }>;

      footer_content: Derive<{
        id: string;
        description: Bilingual;
        quick_links_title: Bilingual;
        services_title: Bilingual;
        contact_title: Bilingual;
        hours_title: Bilingual;
        weekdays_label: Bilingual;
        weekday_hours: Bilingual;
        weekend_label: Bilingual;
        weekend_status: Bilingual;
        copyright: Bilingual;
        updated_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
