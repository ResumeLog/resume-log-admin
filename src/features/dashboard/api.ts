import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export type Granularity = "day" | "week" | "month";

/** `GET /admin/stats/summary`: the numbers right now. */
export interface StatsSummary {
  totalUsers: number;
  activeMonthly: number;
  activeYearly: number;
  /** In-force subscriptions whose billing interval isn't stored yet. */
  unknownInterval: number;
}

/** One bucket of `GET /admin/stats/timeseries`. `total*` are running totals. */
export interface TimeseriesPoint {
  /** Start of the bucket, `YYYY-MM-DD` (UTC). */
  bucket: string;
  newUsers: number;
  totalUsers: number;
  newMonthly: number;
  totalMonthly: number;
  newYearly: number;
  totalYearly: number;
}

export interface TimeseriesQuery {
  granularity: Granularity;
  /** `YYYY-MM-DD`. Omitted: since the first sign-up. */
  from?: string;
  /** `YYYY-MM-DD`. */
  to: string;
}

export function useStatsSummary() {
  return useQuery({
    queryKey: ["admin", "stats", "summary"],
    queryFn: ({ signal }) => apiRequest<StatsSummary>("/admin/stats/summary", { signal }),
  });
}

export function useTimeseries(query: TimeseriesQuery) {
  const params = new URLSearchParams({ granularity: query.granularity, to: query.to });
  if (query.from) params.set("from", query.from);
  return useQuery({
    queryKey: ["admin", "stats", "timeseries", query],
    queryFn: ({ signal }) => apiRequest<TimeseriesPoint[]>(`/admin/stats/timeseries?${params}`, { signal }),
    // Keep the old chart up while a new range loads.
    placeholderData: keepPreviousData,
  });
}
