import type { WeatherSnapshot } from "../types";
import { ErrorState } from "./ErrorState";
import { Metric } from "./Metric";
import { Skeleton } from "./Skeleton";

export function WeatherPanel({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data?: WeatherSnapshot;
  isLoading: boolean;
  error?: { message?: string } | null;
  onRetry: () => void;
}) {
  if (isLoading) return <Skeleton lines={4} />;
  if (error) {
    return (
      <ErrorState
        title="Météo indisponible"
        message={error.message ?? "Impossible de charger la météo."}
        onRetry={onRetry}
      />
    );
  }
  if (!data) return <p className="text-sm text-slate-500">Sélectionnez une ville.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Metric label="Température" value={`${Math.round(data.temperature)}°C`} />
      <Metric label="Ressenti" value={data.condition} />
      <Metric label="Vent" value={`${Math.round(data.windSpeed)} km/h`} />
      <Metric label="Pluie" value={`${Math.round(data.precipitationChance)}%`} />
      <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-white/60 p-4 text-sm text-slate-600">
        Max {Math.round(data.high)}°C · Min {Math.round(data.low)}°C
      </div>
    </div>
  );
}
