import { useEffect, useMemo, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { SearchBar } from "./components/SearchBar";
import { SectionCard } from "./components/SectionCard";
import { WeatherPanel } from "./components/WeatherPanel";
import { PollutionPanel } from "./components/PollutionPanel";
import { TransportPanel } from "./components/TransportPanel";
import { EventsPanel } from "./components/EventsPanel";
import { useCitySearch } from "./hooks/useCitySearch";
import { useWeather } from "./hooks/useWeather";
import { usePollution } from "./hooks/usePollution";
import { useTransport } from "./hooks/useTransport";
import { useEvents } from "./hooks/useEvents";
import type { CityOption } from "./types";

const defaultCity: CityOption = {
  id: "paris",
  name: "Paris",
  country: "FR",
  region: "Ile-de-France",
  latitude: 48.8566,
  longitude: 2.3522,
  timezone: "Europe/Paris",
};

export default function App() {
  const [query, setQuery] = useState(defaultCity.name);
  const [selectedCity, setSelectedCity] = useState<CityOption>(defaultCity);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const citySearch = useCitySearch(query);
  const suggestions = citySearch.data ?? [];

  const weatherQuery = useWeather(selectedCity?.latitude, selectedCity?.longitude);
  const pollutionQuery = usePollution(selectedCity?.latitude, selectedCity?.longitude);
  const transportQuery = useTransport(selectedCity?.name);
  const eventsQuery = useEvents(selectedCity?.name);

  const isFetching = useIsFetching();

  const searchError = citySearch.error
    ? "Impossible de contacter le service de recherche."
    : !citySearch.isFetching && query.trim().length > 2 && suggestions.length === 0
    ? "Aucune ville trouvée. Essayez une autre orthographe."
    : undefined;

  const selectCity = (city: CityOption) => {
    setSelectedCity(city);
    setQuery(city.name);
  };

  const firstSuggestion = useMemo(() => suggestions[0], [suggestions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-10 text-ink transition-colors duration-500 dark:text-slate-100 sm:px-10">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-ember/30 blur-3xl dark:bg-ember/20" />
      <div className="pointer-events-none absolute top-24 -left-16 h-52 w-52 rounded-full bg-aurora/30 blur-3xl dark:bg-aurora/15" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-tide/30 blur-3xl dark:bg-tide/20" />

      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            City Insights
          </p>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-pressed={theme === "dark"}
              className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-glow transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
          <h1 className="font-display text-4xl font-semibold text-ink dark:text-white sm:text-5xl">
            Tout savoir sur votre ville en un instant.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Centralisez la météo, les transports, la qualité de l'air et les événements avec une gestion
            résiliente des données temps réel.
          </p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (firstSuggestion) selectCity(firstSuggestion);
          }}
          className="grid gap-3 md:grid-cols-[2fr,1fr]"
        >
          <SearchBar
            value={query}
            onChange={setQuery}
            onSelect={selectCity}
            suggestions={suggestions}
            isLoading={citySearch.isFetching}
            error={searchError}
            showSuggestions={query.trim().length >= 2 && query !== selectedCity.name}
          />
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Ville active</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink dark:text-white">
              {selectedCity.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCity.region ? `${selectedCity.region}, ` : ""}
              {selectedCity.country}
            </p>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              {isFetching ? "Synchronisation..." : "Données à jour"}
            </div>
          </div>
        </form>
        </header>

        <main className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
        <SectionCard title="Météo">
          <WeatherPanel
            data={weatherQuery.data}
            isLoading={weatherQuery.isLoading}
            error={weatherQuery.error as { message?: string } | null}
            onRetry={() => weatherQuery.refetch()}
          />
        </SectionCard>

        <SectionCard title="Transports">
          <TransportPanel
            data={transportQuery.data}
            isLoading={transportQuery.isLoading}
            error={transportQuery.error as { message?: string } | null}
            onRetry={() => transportQuery.refetch()}
          />
        </SectionCard>

        <SectionCard title="Pollution">
          <PollutionPanel
            data={pollutionQuery.data}
            isLoading={pollutionQuery.isLoading}
            error={pollutionQuery.error as { message?: string } | null}
            onRetry={() => pollutionQuery.refetch()}
          />
        </SectionCard>

        <SectionCard title="Événements">
          <EventsPanel
            data={eventsQuery.data}
            isLoading={eventsQuery.isLoading}
            error={eventsQuery.error as { message?: string } | null}
            onRetry={() => eventsQuery.refetch()}
          />
        </SectionCard>
        </main>

        <footer className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            API météo: Open-Meteo · Pollution: OpenAQ · Transports: transport.rest · Événements:
            Ticketmaster
          </p>
          <p>Cache React Query activé, avec révalidation intelligente et erreurs isolées par module.</p>
          <p className="font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Développé par Zied RJEB
          </p>
        </footer>
      </div>
    </div>
  );
}
