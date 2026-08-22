"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Bilingual } from "@/lib/supabase/database.types";

/** One label + an EN/AR tab switcher, submitting `${name}_en`/`${name}_ar`
 * as two plain form fields (see src/lib/admin/form-helpers.ts). Both
 * language inputs stay mounted at all times -- only their visibility
 * toggles -- so both values are always present in FormData regardless of
 * which tab is showing. */
export function TranslatableInput({
  name,
  label,
  defaultValue,
  multiline,
  rows = 4,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: Bilingual;
  multiline?: boolean;
  rows?: number;
  placeholder?: Bilingual;
  required?: boolean;
}) {
  const [tab, setTab] = useState<"en" | "ar">("en");
  const fieldClass =
    "w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-admin-text">{label}</label>
        <div className="flex overflow-hidden rounded-md border border-admin-border text-xs font-semibold">
          {(["en", "ar"] as const).map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => setTab(lng)}
              className={cn(
                "px-2.5 py-1 transition-colors",
                tab === lng ? "bg-admin-accent text-white" : "bg-admin-surface text-admin-muted hover:bg-admin-bg"
              )}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <>
          <textarea
            name={`${name}_en`}
            defaultValue={defaultValue?.en}
            placeholder={placeholder?.en}
            required={required}
            dir="ltr"
            rows={rows}
            className={cn(fieldClass, tab !== "en" && "hidden")}
          />
          <textarea
            name={`${name}_ar`}
            defaultValue={defaultValue?.ar}
            placeholder={placeholder?.ar}
            required={required}
            dir="rtl"
            rows={rows}
            className={cn(fieldClass, tab !== "ar" && "hidden")}
          />
        </>
      ) : (
        <>
          <input
            type="text"
            name={`${name}_en`}
            defaultValue={defaultValue?.en}
            placeholder={placeholder?.en}
            required={required}
            dir="ltr"
            className={cn(fieldClass, tab !== "en" && "hidden")}
          />
          <input
            type="text"
            name={`${name}_ar`}
            defaultValue={defaultValue?.ar}
            placeholder={placeholder?.ar}
            required={required}
            dir="rtl"
            className={cn(fieldClass, tab !== "ar" && "hidden")}
          />
        </>
      )}
    </div>
  );
}
