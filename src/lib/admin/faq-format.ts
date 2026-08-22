import type { Bilingual } from "@/lib/supabase/database.types";

export type FaqItem = { question: Bilingual; answer: Bilingual };

/** surgeries.faq is stored as a jsonb array of {question:{en,ar}, answer:{en,ar}}.
 * Rather than building a dynamic add/remove list UI, the admin form
 * represents it as two plain-text areas (one per language) with one
 * "Question :: Answer" pair per line, paired up by line index. This keeps
 * the form to the same EN/AR-tabbed TranslatableInput used everywhere else
 * with no extra client-side state. */
export function parseFaqLines(en: string, ar: string): FaqItem[] | null {
  const enLines = en.split("\n").map((l) => l.trim()).filter(Boolean);
  const arLines = ar.split("\n").map((l) => l.trim()).filter(Boolean);
  const max = Math.max(enLines.length, arLines.length);
  if (max === 0) return null;

  const items: FaqItem[] = [];
  for (let i = 0; i < max; i++) {
    const [qEn = "", ...aEnParts] = (enLines[i] ?? "").split("::");
    const [qAr = "", ...aArParts] = (arLines[i] ?? "").split("::");
    const question = { en: qEn.trim(), ar: qAr.trim() };
    const answer = { en: aEnParts.join("::").trim(), ar: aArParts.join("::").trim() };
    if (!question.en && !question.ar) continue;
    items.push({ question, answer });
  }
  return items.length > 0 ? items : null;
}

export function serializeFaqLines(faq: FaqItem[] | null): Bilingual {
  if (!faq || faq.length === 0) return { en: "", ar: "" };
  return {
    en: faq.map((f) => `${f.question.en} :: ${f.answer.en}`).join("\n"),
    ar: faq.map((f) => `${f.question.ar} :: ${f.answer.ar}`).join("\n"),
  };
}
