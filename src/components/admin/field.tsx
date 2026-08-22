import { cn } from "@/lib/utils";

/** Plain (non-bilingual) text input -- for phone numbers, URLs, slugs,
 * years, numbers, etc. that are locale-invariant. */
export function Field({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
  required,
  dir = "ltr",
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-admin-text">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className={cn(
          "w-full rounded-lg border border-admin-border px-3 py-2 text-sm outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
        )}
      />
    </div>
  );
}
