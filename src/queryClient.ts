import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";

const MAX_RETRIES = 2;

/** Retries server and network errors, not 4xx. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
}
