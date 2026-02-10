import { fetchJson } from "./http";
import type { CityOption } from "../types";

type GeocodingResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone?: string;
  }>;
};

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(query: string): Promise<CityOption[]> {
  if (!query.trim()) return [];
  const url = new URL(BASE_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "6");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const data = await fetchJson<GeocodingResponse>(url.toString());
  return (
    data.results?.map((city) => ({
      id: String(city.id),
      name: city.name,
      country: city.country,
      region: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
    })) ?? []
  );
}
