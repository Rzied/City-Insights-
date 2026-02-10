import type { CityOption } from "../types";

export function SearchBar({
  value,
  onChange,
  onSelect,
  suggestions,
  isLoading,
  error,
  showSuggestions = true,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (city: CityOption) => void;
  suggestions: CityOption[];
  isLoading: boolean;
  error?: string;
  showSuggestions?: boolean;
}) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Ville
      </label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Rechercher Paris, Montreal, Tokyo..."
          className="w-full bg-transparent font-display text-lg text-ink placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
          aria-label="Search city"
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {isLoading ? "Recherche..." : "Entrée"}
        </span>
      </div>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      {showSuggestions && suggestions.length > 0 ? (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-white/70 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">
          {suggestions.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelect(city)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span className="font-medium text-ink dark:text-white">{city.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {city.region ? `${city.region}, ` : ""}
                {city.country}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
