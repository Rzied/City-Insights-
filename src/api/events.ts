import { fetchJson, missingKeyError } from "./http";
import type { EventItem } from "../types";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY as string | undefined;
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export async function fetchEvents(city: string): Promise<EventItem[]> {
  if (!apiKey) {
    if (useMocks) {
      const { mockEvents } = await import("../data/mock");
      return mockEvents;
    }
    throw missingKeyError("VITE_TICKETMASTER_API_KEY");
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("city", city);
  url.searchParams.set("size", "6");
  url.searchParams.set("sort", "date,asc");

  const data = await fetchJson<{
    _embedded?: {
      events?: Array<{
        id: string;
        name: string;
        dates?: { start?: { localDate?: string } };
        _embedded?: {
          venues?: Array<{ name?: string }>;
        };
        url?: string;
      }>;
    };
  }>(url.toString());

  return (
    data._embedded?.events?.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates?.start?.localDate ?? "TBD",
      venue: event._embedded?.venues?.[0]?.name ?? "Venue TBD",
      url: event.url,
    })) ?? []
  );
}
