import type { TransportSnapshot } from "../types";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./Skeleton";

export function TransportPanel({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data?: TransportSnapshot;
  isLoading: boolean;
  error?: { message?: string } | null;
  onRetry: () => void;
}) {
  if (isLoading) return <Skeleton lines={4} />;
  if (error) {
    return (
      <ErrorState
        title="Transports indisponibles"
        message={error.message ?? "Impossible de charger les transports."}
        onRetry={onRetry}
      />
    );
  }
  if (!data) return <p className="text-sm text-slate-500">Sélectionnez une ville.</p>;

  if (!data.departures.length) {
    return <p className="text-sm text-slate-500">Aucun départ trouvé pour cette ville.</p>;
  }

  return (
    <div className="space-y-3">
      {data.departures.map((departure, index) => (
        <div
          key={`${departure.line}-${index}`}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/60 px-4 py-3 text-sm"
        >
          <div>
            <p className="font-display text-base font-semibold text-ink">{departure.line}</p>
            <p className="text-xs text-slate-500">Vers {departure.direction}</p>
          </div>
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {departure.minutes} min
          </span>
        </div>
      ))}
    </div>
  );
}
