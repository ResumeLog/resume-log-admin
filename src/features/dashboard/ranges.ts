import type { Granularity, TimeseriesQuery } from "./api";

export interface RangeOption {
  id: string;
  label: string;
  /** How many buckets back from today, including today's. `null`: all time. */
  count: number | null;
}

/** The ranges that make sense at each granularity. The first is the default. */
export const RANGES: Record<Granularity, RangeOption[]> = {
  day: [
    { id: "30d", label: "Last 30 days", count: 30 },
    { id: "7d", label: "Last 7 days", count: 7 },
    { id: "90d", label: "Last 90 days", count: 90 },
  ],
  week: [
    { id: "12w", label: "Last 12 weeks", count: 12 },
    { id: "26w", label: "Last 26 weeks", count: 26 },
    { id: "52w", label: "Last 52 weeks", count: 52 },
  ],
  month: [
    { id: "12m", label: "Last 12 months", count: 12 },
    { id: "6m", label: "Last 6 months", count: 6 },
    { id: "24m", label: "Last 24 months", count: 24 },
    { id: "all", label: "All time", count: null },
  ],
};

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** The API query for a range ending today (UTC, like the API's buckets). */
export function rangeQuery(granularity: Granularity, range: RangeOption, today = new Date()): TimeseriesQuery {
  const to = isoDate(today);
  if (range.count === null) return { granularity, to };
  const from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const back = range.count - 1;
  if (granularity === "day") from.setUTCDate(from.getUTCDate() - back);
  if (granularity === "week") from.setUTCDate(from.getUTCDate() - back * 7);
  if (granularity === "month") from.setUTCMonth(from.getUTCMonth() - back, 1);
  return { granularity, from: isoDate(from), to };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Axis label for a bucket: "Mar 4" for days and weeks, "Mar 2026" for months. */
export function bucketLabel(bucket: string, granularity: Granularity): string {
  const [year, month, day] = bucket.split("-").map(Number);
  return granularity === "month" ? `${MONTHS[month - 1]} ${year}` : `${MONTHS[month - 1]} ${day}`;
}

/** Tooltip / table label: says what the bucket covers. */
export function bucketTitle(bucket: string, granularity: Granularity): string {
  const label = bucketLabel(bucket, granularity);
  return granularity === "week" ? `Week of ${label}` : label;
}
