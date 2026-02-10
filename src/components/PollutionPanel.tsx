import type { PollutionSnapshot } from "../types";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./Skeleton";

export function PollutionPanel({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data?: PollutionSnapshot;
  isLoading: boolean;
  error?: { message?: string } | null;
  onRetry: () => void;
}) {
  if (isLoading) return <Skeleton lines={4} />;
  if (error) {
    return (
      <ErrorState
        title="Pollution indisponible"
        message={error.message ?? "Impossible de charger la pollution."}
        onRetry={onRetry}
      />
    );
  }
  if (!data) return <p className="text-sm text-slate-500 dark:text-slate-400">Sélectionnez une ville.</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Indice global</p>
        <p className="mt-2 font-display text-3xl font-semibold text-ink dark:text-white">{data.aqi}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{data.category} · Dominant {data.dominantPollutant}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {data.measurements.map((measurement) => (
          <div
            key={measurement.label}
            className="rounded-2xl border border-slate-100 bg-white/60 p-3 text-sm text-slate-700 backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{measurement.label}</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink dark:text-white">
              {measurement.value} {measurement.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
