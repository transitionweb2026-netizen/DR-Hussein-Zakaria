import { createClient } from "@/lib/supabase/server";

const ID = "00000000-0000-0000-0000-000000000001";

export async function getContactPageContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_page_content").select("*").eq("id", ID).maybeSingle();
  return data;
}

/** Admin-only (RLS restricts SELECT on contact_submissions to admins). */
export async function getContactSubmissions() {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
