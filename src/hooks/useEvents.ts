import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../api/events";

export function useEvents(city?: string) {
  return useQuery({
    queryKey: ["events", city],
    queryFn: () => fetchEvents(city!),
    enabled: Boolean(city && city.trim().length > 1),
    staleTime: 1000 * 60 * 20,
  });
}
