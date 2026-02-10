import { useQuery } from "@tanstack/react-query";
import { searchCities } from "../api/geocoding";

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ["cities", query],
    queryFn: () => searchCities(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}
