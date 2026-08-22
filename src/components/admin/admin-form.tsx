"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { idleState, type ActionState } from "@/lib/admin/form-helpers";
import { SaveButton } from "./save-button";

/** Wraps a Server Action with useActionState so a save shows an inline
 * success/error banner without any client-side data fetching -- the action
 * itself does the Supabase write and returns { status, message }. */
export function AdminForm({
  action,
  children,
  saveLabel,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  saveLabel?: string;
}) {
  const [state, formAction] = useActionState(action, idleState);

  return (
    <form action={formAction} className="space-y-6">
      {children}
      <div className="flex items-center gap-3 border-t border-admin-border pt-5">
        <SaveButton label={saveLabel} />
        {state.status === "success" && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-admin-success">
            <CheckCircle2 className="h-4 w-4" />
            {state.message ?? "Saved"}
          </span>
        )}
        {state.status === "error" && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-admin-danger">
            <AlertCircle className="h-4 w-4" />
            {state.message ?? "Something went wrong"}
          </span>
        )}
      </div>
    </form>
  );
}
