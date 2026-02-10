import type { WeatherSnapshot, PollutionSnapshot, EventItem, TransportSnapshot } from "../types";

export const mockWeather: WeatherSnapshot = {
  temperature: 21,
  windSpeed: 12,
  condition: "Partly cloudy",
  high: 24,
  low: 16,
  precipitationChance: 20,
};

export const mockPollution: PollutionSnapshot = {
  aqi: 42,
  category: "Good",
  dominantPollutant: "PM2.5",
  measurements: [
    { label: "PM2.5", value: 8, unit: "ug/m3" },
    { label: "PM10", value: 12, unit: "ug/m3" },
    { label: "O3", value: 40, unit: "ug/m3" },
  ],
};

export const mockEvents: EventItem[] = [
  {
    id: "event-1",
    name: "City Lights Jazz Night",
    date: "2026-03-14",
    venue: "Riverside Hall",
    url: "https://example.com",
  },
  {
    id: "event-2",
    name: "Urban Tech Meetup",
    date: "2026-03-18",
    venue: "Innovation Hub",
    url: "https://example.com",
  },
];

export const mockTransport: TransportSnapshot = {
  line: "M1",
  destination: "Central Station",
  departures: [
    { line: "M1", direction: "Central Station", minutes: 4 },
    { line: "M1", direction: "Central Station", minutes: 11 },
    { line: "T3", direction: "Old Town", minutes: 16 },
  ],
};
