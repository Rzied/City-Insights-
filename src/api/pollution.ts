import { fetchJson } from "./http";
import type { PollutionSnapshot } from "../types";

type OpenAQResponse = {
  results: Array<{
    measurements: Array<{
      parameter: string;
      value: number;
      unit: string;
    }>;
  }>;
};

const BASE_URL = "https://api.openaq.org/v2/latest";
const OPENAQ_API_KEY = import.meta.env.VITE_OPENAQ_API_KEY as string | undefined;

const pollutantLabels: Record<string, string> = {
  pm25: "PM2.5",
  pm10: "PM10",
  o3: "O3",
  no2: "NO2",
  so2: "SO2",
  co: "CO",
};

export async function fetchPollution(latitude: number, longitude: number): Promise<PollutionSnapshot> {
  const url = new URL(BASE_URL);
  url.searchParams.set("coordinates", `${latitude},${longitude}`);
  url.searchParams.set("radius", "5000");
  url.searchParams.set("limit", "100");

  const data = await fetchJson<OpenAQResponse>(url.toString(), {
    headers: OPENAQ_API_KEY ? { "X-API-Key": OPENAQ_API_KEY } : undefined,
  });
  const measurements = data.results?.[0]?.measurements ?? [];

  const mapped = measurements.slice(0, 4).map((measurement) => ({
    label: pollutantLabels[measurement.parameter] ?? measurement.parameter.toUpperCase(),
    value: Math.round(measurement.value),
    unit: measurement.unit,
  }));

  const dominant = mapped[0]?.label ?? "PM2.5";
  const aqi = mapped[0]?.value ? Math.min(300, mapped[0].value * 5) : 50;

  const category =
    aqi < 50
      ? "Good"
      : aqi < 100
      ? "Moderate"
      : aqi < 150
      ? "Unhealthy for Sensitive"
      : aqi < 200
      ? "Unhealthy"
      : "Very Unhealthy";

  return {
    aqi,
    category,
    dominantPollutant: dominant,
    measurements: mapped,
  };
}
