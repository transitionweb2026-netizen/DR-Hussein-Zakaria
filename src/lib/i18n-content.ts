import type { Bilingual } from "@/lib/supabase/database.types";

/** Reads the right-language string out of a {en, ar} jsonb field fetched
 * from Supabase, given the current next-intl locale. Falls back to English
 * (then the empty string) if the requested language is blank -- an admin
 * partway through translating shouldn't produce a visibly empty section. */
export function pickLocale(field: Bilingual | null | undefined, locale: string, fallback = ""): string {
  if (!field) return fallback;
  const value = locale === "ar" ? field.ar : field.en;
  return value || field.en || fallback;
}
