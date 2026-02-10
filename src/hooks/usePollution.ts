import { useQuery } from "@tanstack/react-query";
import { fetchPollution } from "../api/pollution";

export function usePollution(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: ["pollution", latitude, longitude],
    queryFn: () => fetchPollution(latitude!, longitude!),
    enabled: typeof latitude === "number" && typeof longitude === "number",
    staleTime: 1000 * 60 * 15,
  });
}
