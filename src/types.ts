export type CityOption = {
  id: string;
  name: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type WeatherSnapshot = {
  temperature: number;
  windSpeed: number;
  condition: string;
  high: number;
  low: number;
  precipitationChance: number;
};

export type PollutionMeasurement = {
  label: string;
  value: number;
  unit: string;
};

export type PollutionSnapshot = {
  aqi: number;
  category: string;
  dominantPollutant: string;
  measurements: PollutionMeasurement[];
};

export type EventItem = {
  id: string;
  name: string;
  date: string;
  venue: string;
  url?: string;
};

export type TransportDeparture = {
  line: string;
  direction: string;
  minutes: number;
};

export type TransportSnapshot = {
  line?: string;
  destination?: string;
  departures: TransportDeparture[];
};
