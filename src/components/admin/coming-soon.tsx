import { Construction } from "lucide-react";
import { PageHeader } from "./page-header";

/** Placeholder for sidebar sections not yet wired to real Supabase CRUD --
 * keeps every nav link in the sidebar navigable (no 404s) while the
 * remaining phases (Services/Detailed Surgeries, Videos, Patient Stories,
 * Reviews, Articles, Contact, Media Library, About Doctor page) are built
 * out. Home and Global Settings are fully live already. */
export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-admin-border bg-admin-surface p-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-accent/10 text-admin-accent">
          <Construction className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-admin-text">Not wired up yet</p>
        <p className="max-w-sm text-sm text-admin-muted">
          This section&apos;s database tables and RLS policies already exist (see supabase/migrations/) -- the admin
          CRUD screen and frontend wiring for it are planned for {phase}.
        </p>
      </div>
    </div>
  );
}
