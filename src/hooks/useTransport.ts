import { useQuery } from "@tanstack/react-query";
import { fetchTransport } from "../api/transport";

export function useTransport(city?: string) {
  return useQuery({
    queryKey: ["transport", city],
    queryFn: () => fetchTransport(city!),
    enabled: Boolean(city && city.trim().length > 1),
    staleTime: 1000 * 60 * 2,
  });
}
