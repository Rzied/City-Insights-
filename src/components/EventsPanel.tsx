import type { EventItem } from "../types";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./Skeleton";

export function EventsPanel({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data?: EventItem[];
  isLoading: boolean;
  error?: { message?: string } | null;
  onRetry: () => void;
}) {
  if (isLoading) return <Skeleton lines={4} />;
  if (error) {
    return (
      <ErrorState
        title="Événements indisponibles"
        message={error.message ?? "Impossible de charger les événements."}
        onRetry={onRetry}
      />
    );
  }
  if (!data) return <p className="text-sm text-slate-500 dark:text-slate-400">Sélectionnez une ville.</p>;
  if (!data.length) return <p className="text-sm text-slate-500 dark:text-slate-400">Aucun événement trouvé.</p>;

  return (
    <div className="space-y-3">
      {data.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl border border-slate-100 bg-white/60 px-4 py-3 text-sm backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-base font-semibold text-ink dark:text-white">{event.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{event.venue}</p>
            </div>
            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-ink">
              {event.date}
            </span>
          </div>
          {event.url ? (
            <a
              href={event.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wide text-ink dark:text-slate-200"
            >
              Billetterie
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
