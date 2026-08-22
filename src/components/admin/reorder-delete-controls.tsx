import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

/** The move-up/move-down/delete row footer shared by every repeatable-
 * content admin list (stats, timeline, certificates, surgeries, videos,
 * stories, reviews, articles, ...). Each action is its own tiny <form> so
 * no client-side JS is needed to wire them up. */
export function ReorderDeleteControls({
  id,
  isFirst,
  isLast,
  moveAction,
  deleteAction,
  extraFields,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
  moveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  /** Extra hidden fields the move/delete actions need beyond `id`
   * (e.g. a parent surgery_id when the list is scoped to one category). */
  extraFields?: Record<string, string>;
}) {
  const hidden = Object.entries(extraFields ?? {});

  return (
    <div className="mt-3 flex items-center gap-1.5 border-t border-admin-border pt-3">
      <form action={moveAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        {hidden.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button
          type="submit"
          disabled={isFirst}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-admin-border text-admin-muted hover:bg-admin-bg disabled:opacity-30"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </form>
      <form action={moveAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        {hidden.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button
          type="submit"
          disabled={isLast}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-admin-border text-admin-muted hover:bg-admin-bg disabled:opacity-30"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </form>
      <form action={deleteAction} className="ms-auto">
        <input type="hidden" name="id" value={id} />
        {hidden.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button
          type="submit"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-admin-border text-admin-danger hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
