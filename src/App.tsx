import { useMemo, useState } from "react";
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

  return (
    <div className="min-h-screen px-4 pb-16 pt-10 text-ink sm:px-10">
      <header className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            City Insights
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Tout savoir sur votre ville en un instant.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
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
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-glow">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ville active</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {selectedCity.name}
            </p>
            <p className="text-xs text-slate-500">
              {selectedCity.region ? `${selectedCity.region}, ` : ""}
              {selectedCity.country}
            </p>
            <div className="mt-3 text-xs text-slate-400">
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

      <footer className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 text-xs text-slate-500">
        <p>
          API météo: Open-Meteo · Pollution: OpenAQ · Transports: transport.rest · Événements:
          Ticketmaster
        </p>
        <p>Cache React Query activé, avec révalidation intelligente et erreurs isolées par module.</p>
      </footer>
    </div>
  );
}
