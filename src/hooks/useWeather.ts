import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "../api/weather";

export function useWeather(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => fetchWeather(latitude!, longitude!),
    enabled: typeof latitude === "number" && typeof longitude === "number",
    staleTime: 1000 * 60 * 10,
  });
}
