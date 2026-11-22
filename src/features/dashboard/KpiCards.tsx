import CircleAlertIcon from "@/lib/foundations/icons/mono/circle-alert.svg?react";
import type { StatsSummary } from "./api";
import { SERIES } from "./series";

function Tile({ label, value, swatch }: { label: string; value: number | undefined; swatch?: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-xlarge border border-border-default bg-elevation-surface p-4">
      <span className="flex items-center gap-1-5 font-medium text-small leading-5 text-text-subtle">
        {swatch && <span aria-hidden className="h-0-5 w-3 rounded-full" style={{ background: swatch }} />}
        {label}
      </span>
      <span className="font-semibold text-xlarge leading-7 tracking-tightest text-text-default tabular-nums">
        {value === undefined ? "–" : value.toLocaleString()}
      </span>
    </div>
  );
}

/** Today's numbers. They don't change with the chart filters. */
export function KpiCards({ summary }: { summary: StatsSummary | undefined }) {
  return (
    <section aria-label="Current totals" className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 min-[640px]:flex-row">
        <Tile label="Total users" value={summary?.totalUsers} />
        <Tile label="Active monthly subscriptions" value={summary?.activeMonthly} swatch={SERIES.monthly.color} />
        <Tile label="Active yearly subscriptions" value={summary?.activeYearly} swatch={SERIES.yearly.color} />
      </div>
      {!!summary?.unknownInterval && (
        <p className="flex items-center gap-1-5 font-medium text-xsmall leading-4 text-text-subtle">
          <CircleAlertIcon aria-hidden className="size-4 shrink-0" />
          {summary.unknownInterval.toLocaleString()} active subscription
          {summary.unknownInterval === 1 ? " has" : "s have"} no billing interval yet, so they aren't counted as monthly
          or yearly. Run <code>npm run paddle:backfill-intervals -- --apply</code> in resume-log-be.
        </p>
      )}
    </section>
  );
}
