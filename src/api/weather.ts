import { fetchJson } from "./http";
import type { WeatherSnapshot } from "../types";

type WeatherResponse = {
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  };
};

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCodeMap: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  61: "Rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Snow",
  80: "Rain showers",
  95: "Thunderstorm",
};

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherSnapshot> {
  const url = new URL(BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current_weather", "true");
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("timezone", "auto");

  const data = await fetchJson<WeatherResponse>(url.toString());
  const todayHigh = data.daily?.temperature_2m_max?.[0] ?? data.current_weather?.temperature ?? 0;
  const todayLow = data.daily?.temperature_2m_min?.[0] ?? data.current_weather?.temperature ?? 0;
  const precipitation = data.daily?.precipitation_probability_max?.[0] ?? 0;
  const condition =
    weatherCodeMap[data.current_weather?.weathercode ?? 0] ?? "Local conditions";

  return {
    temperature: data.current_weather?.temperature ?? todayHigh,
    windSpeed: data.current_weather?.windspeed ?? 0,
    condition,
    high: todayHigh,
    low: todayLow,
    precipitationChance: precipitation,
  };
}
