import { fetchJson } from "./http";
import type { TransportSnapshot } from "../types";

const defaultBase = "/api/transport";
const baseUrl = (import.meta.env.VITE_TRANSPORT_API_BASE as string | undefined) ?? defaultBase;
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export async function fetchTransport(city: string): Promise<TransportSnapshot> {
  if (useMocks) {
    const { mockTransport } = await import("../data/mock");
    return mockTransport;
  }

  const locationsUrl = new URL(`${baseUrl}/locations`, window.location.origin);
  locationsUrl.searchParams.set("query", city);
  locationsUrl.searchParams.set("results", "1");
  locationsUrl.searchParams.set("type", "stop");

  const locationData = await fetchJson<
    Array<{
      id: string;
      name: string;
    }>
  >(locationsUrl.toString());

  if (!locationData.length) {
    return { departures: [] };
  }

  const stopId = locationData[0].id;
  const departuresUrl = new URL(`${baseUrl}/stops/${stopId}/departures`, window.location.origin);
  departuresUrl.searchParams.set("duration", "90");

  const departuresData = await fetchJson<{
    departures: Array<{
      line?: { name?: string };
      direction?: string;
      when?: string;
      plannedWhen?: string;
    }>;
  }>(departuresUrl.toString());

  const now = new Date();
  const departures = departuresData.departures.slice(0, 6).map((departure) => {
    const time = departure.when ?? departure.plannedWhen;
    const minutes = time ? Math.max(0, Math.round((new Date(time).getTime() - now.getTime()) / 60000)) : 0;
    return {
      line: departure.line?.name ?? "Transit",
      direction: departure.direction ?? "Direction TBD",
      minutes,
    };
  });

  return {
    line: departures[0]?.line,
    destination: departures[0]?.direction,
    departures,
  };
}
