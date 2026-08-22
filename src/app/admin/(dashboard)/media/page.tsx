import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { getAllMedia } from "@/lib/data/media";
import { deleteMedia } from "./actions";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaLibraryPage() {
  const items = await getAllMedia();
  const byFolder = new Map<string, typeof items>();
  for (const item of items) {
    const list = byFolder.get(item.folder) ?? [];
    list.push(item);
    byFolder.set(item.folder, list);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Media Library"
        description={`${items.length} file${items.length === 1 ? "" : "s"} across every uploaded field on the site. Uploads happen inline wherever an image field appears -- this screen is for browsing and cleanup.`}
      />

      {[...byFolder.entries()].map(([folder, files]) => (
        <div key={folder}>
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-admin-muted">{folder}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {files.map((file) => (
              <div key={file.id} className="group relative overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
                <div className="relative aspect-square w-full bg-admin-bg">
                  {file.url && file.mime_type.startsWith("image/") ? (
                    <Image src={file.url} alt={file.filename} fill sizes="200px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-admin-muted">{file.mime_type}</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-[11px] font-medium text-admin-text" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-[10px] text-admin-muted">{formatSize(file.size_bytes)}</p>
                </div>
                <form action={deleteMedia} className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <input type="hidden" name="id" value={file.id} />
                  <input type="hidden" name="bucket" value={file.bucket} />
                  <input type="hidden" name="path" value={file.path} />
                  <button
                    type="submit"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-admin-danger text-xs font-bold text-white shadow"
                    title="Delete (only if unused elsewhere)"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length === 0 && <p className="text-sm text-admin-muted">No files uploaded yet.</p>}
    </div>
  );
}
