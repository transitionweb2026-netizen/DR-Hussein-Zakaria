import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Server Supabase client -- for Server Components, Server Actions, and
 * Route Handlers. Still the anon key: the calling user's own session
 * (read from cookies) is what RLS evaluates against, so an authenticated
 * admin gets admin-level access through this same client automatically via
 * the is_admin() policies -- no service-role key involved.
 *
 * Create a fresh client per request; never module-level singleton this.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component render (not a Server Action or
            // Route Handler) -- cookies can't be written there. Harmless as
            // long as src/middleware.ts also refreshes the session, which
            // it does for every /admin request (see supabase/middleware.ts).
          }
        },
      },
    }
  );
}
