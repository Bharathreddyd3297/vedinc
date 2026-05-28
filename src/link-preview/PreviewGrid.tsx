import { ADMIN_WEBSITES } from "./preview.config";
import { PreviewCard } from "./PreviewCard";

export function PreviewGrid() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_WEBSITES
                .filter((site) => site.enabled)
                .map((site) => (
                    <PreviewCard key={site.id} url={site.url} />
                ))}
        </div>
    );
}
