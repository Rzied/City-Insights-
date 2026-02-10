import { useQuery } from "@tanstack/react-query";
import { fetchTransport } from "../api/transport";

export function useTransport(city?: string) {
  return useQuery({
    queryKey: ["transport", city],
    queryFn: () => fetchTransport(city!),
    enabled: Boolean(city && city.trim().length > 1),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: unknown) => {
      const status = typeof error === "object" && error && "status" in error ? (error as { status?: number }).status : undefined;
      if (status === 429) return false;
      return failureCount < 2;
    },
  });
}
