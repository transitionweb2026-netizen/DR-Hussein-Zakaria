"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = { status: "idle" | "success" | "error"; message?: string };

export const idleContactFormState: ContactFormState = { status: "idle" };

/** Public-facing -- reachable by anonymous visitors. Uses the request's
 * anon-session Supabase client (never the service role key); RLS's
 * `contact_submissions_public_insert` policy is what actually authorizes
 * this write (anon/authenticated INSERT-only, no read access). */
export async function submitContactForm(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "missing_fields" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    phone: phone || null,
    message,
    status: "new",
  });

  if (error) return { status: "error", message: "submit_failed" };
  return { status: "success" };
}
