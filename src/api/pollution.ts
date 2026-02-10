import { fetchJson } from "./http";
import type { PollutionSnapshot } from "../types";

type OpenAQLocationsResponse = {
  results: Array<{
    id: number;
  }>;
};

type OpenAQSensorsResponse = {
  results: Array<{
    id: number;
    parameter: {
      name: string;
      units: string;
      displayName?: string | null;
    };
  }>;
};

type OpenAQLatestResponse = {
  results: Array<{
    value: number;
    sensorsId: number;
  }>;
};

const BASE_URL = "/api/openaq/v3";
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
  const headers = OPENAQ_API_KEY ? { "X-API-Key": OPENAQ_API_KEY } : undefined;
  const locationsUrl = new URL(`${BASE_URL}/locations`, window.location.origin);
  locationsUrl.searchParams.set("coordinates", `${latitude},${longitude}`);
  locationsUrl.searchParams.set("radius", "5000");
  locationsUrl.searchParams.set("limit", "1");

  const locationsData = await fetchJson<OpenAQLocationsResponse>(locationsUrl.toString(), { headers });
  const locationId = locationsData.results?.[0]?.id;

  if (!locationId) {
    return {
      aqi: 50,
      category: "Moderate",
      dominantPollutant: "PM2.5",
      measurements: [],
    };
  }

  const sensorsUrl = new URL(`${BASE_URL}/locations/${locationId}/sensors`, window.location.origin);
  sensorsUrl.searchParams.set("limit", "200");
  const sensorsData = await fetchJson<OpenAQSensorsResponse>(sensorsUrl.toString(), { headers });
  const sensorMap = new Map(
    sensorsData.results.map((sensor) => [
      sensor.id,
      {
        name: sensor.parameter.name,
        displayName: sensor.parameter.displayName,
        units: sensor.parameter.units,
      },
    ])
  );

  const latestUrl = new URL(`${BASE_URL}/locations/${locationId}/latest`, window.location.origin);
  latestUrl.searchParams.set("limit", "100");
  const latestData = await fetchJson<OpenAQLatestResponse>(latestUrl.toString(), { headers });

  const measurements = latestData.results
    .map((measurement) => {
      const sensor = sensorMap.get(measurement.sensorsId);
      if (!sensor) {
        return null;
      }
      const label =
        pollutantLabels[sensor.name] ??
        sensor.displayName ??
        sensor.name.toUpperCase();
      return {
        label,
        value: Math.round(measurement.value),
        unit: sensor.units,
      };
    })
    .filter((measurement): measurement is { label: string; value: number; unit: string } => Boolean(measurement));

  const mapped = measurements.slice(0, 4);

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
