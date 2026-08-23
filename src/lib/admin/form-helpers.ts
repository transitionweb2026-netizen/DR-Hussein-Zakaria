import type { Bilingual } from "@/lib/supabase/database.types";

/** Pairs with <TranslatableInput name="title" .../>, which submits two
 * plain fields ("title_en", "title_ar") rather than serialized JSON, so
 * native <form>/FormData keeps working with no client-side JS required to
 * assemble the value. */
export function bilingualFromForm(formData: FormData, name: string): Bilingual {
  return {
    en: String(formData.get(`${name}_en`) ?? ""),
    ar: String(formData.get(`${name}_ar`) ?? ""),
  };
}

export function stringFromForm(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "");
}

export function nullableStringFromForm(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value === "" ? null : value;
}

export function numberFromForm(formData: FormData, name: string, fallback: number): number {
  const value = Number(formData.get(name));
  return Number.isFinite(value) ? value : fallback;
}

/** Checkboxes only appear in FormData when checked -- absence means false,
 * not "unset", so this doesn't need a fallback parameter. */
export function boolFromForm(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

export type ActionState = { status: "idle" | "success" | "error"; message?: string };

export const idleState: ActionState = { status: "idle" };
