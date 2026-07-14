import { Info } from "lucide-react";
import type { DatasetRelease } from "@/lib/catalog";

export function DatasetNotice({ release }: { release: DatasetRelease | null }) {
  if (!release?.is_demonstration) return null;
  return (
    <aside className="dataset-notice" aria-label="Dataset status">
      <Info aria-hidden="true" size={18} />
      <p><strong>Demonstration dataset.</strong> {release.disclosure}</p>
    </aside>
  );
}
