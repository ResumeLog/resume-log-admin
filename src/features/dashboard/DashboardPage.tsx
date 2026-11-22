import { useMemo, useState } from "react";
import { Tabs } from "@/lib/components";
import { controlStyles } from "@/lib/components/Input/controlStyles";
import { cn } from "@/lib/utils/cn";
import { useStatsSummary, useTimeseries, type Granularity } from "./api";
import { ChartCard, NewBars, TotalLines, type ChartSeries } from "./charts";
import { DataTable } from "./DataTable";
import { KpiCards } from "./KpiCards";
import { RANGES, rangeQuery } from "./ranges";
import { SERIES } from "./series";

const GRANULARITIES: { value: Granularity; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const NEW_USERS: ChartSeries[] = [{ key: "newUsers", ...SERIES.users }];
const TOTAL_USERS: ChartSeries[] = [{ key: "totalUsers", ...SERIES.users }];
const NEW_SUBS: ChartSeries[] = [
  { key: "newMonthly", ...SERIES.monthly },
  { key: "newYearly", ...SERIES.yearly },
];
const TOTAL_SUBS: ChartSeries[] = [
  { key: "totalMonthly", ...SERIES.monthly },
  { key: "totalYearly", ...SERIES.yearly },
];
const TABLE_SERIES: ChartSeries[] = [
  { key: "newUsers", label: "New users", color: "" },
  { key: "totalUsers", label: "Total users", color: "" },
  { key: "newMonthly", label: "New monthly", color: "" },
  { key: "newYearly", label: "New yearly", color: "" },
  { key: "totalMonthly", label: "Monthly to date", color: "" },
  { key: "totalYearly", label: "Yearly to date", color: "" },
];

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0-5">
        <h2 className="font-semibold text-medium leading-6 tracking-tighter text-text-default">{title}</h2>
        {note && <p className="font-medium text-xsmall leading-4 text-text-subtle">{note}</p>}
      </div>
      <div className="flex flex-col gap-3 min-[900px]:flex-row">{children}</div>
    </section>
  );
}

export function DashboardPage() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [rangeId, setRangeId] = useState(RANGES.day[0].id);
  const ranges = RANGES[granularity];
  const range = ranges.find((r) => r.id === rangeId) ?? ranges[0];
  const query = useMemo(() => rangeQuery(granularity, range), [granularity, range]);

  const summary = useStatsSummary();
  const series = useTimeseries(query);
  const data = series.data ?? [];

  const changeGranularity = (next: Granularity) => {
    setGranularity(next);
    setRangeId(RANGES[next][0].id);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-4 min-[640px]:p-6">
      <KpiCards summary={summary.data} />

      <div className="flex flex-wrap items-center gap-2">
        <Tabs label="Group by" options={GRANULARITIES} value={granularity} onValueChange={changeGranularity} />
        <label className="sr-only" htmlFor="range">
          Date range
        </label>
        <select
          id="range"
          value={range.id}
          onChange={(e) => setRangeId(e.target.value)}
          className={cn(controlStyles, "h-7 w-auto cursor-pointer py-[0] pr-7")}
        >
          {ranges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        {series.isFetching && <span className="font-medium text-xsmall text-text-subtle">Loading…</span>}
      </div>

      {series.isError ? (
        <p role="alert" className="rounded-xlarge border border-border-danger p-4 text-small text-text-danger">
          Couldn't load the charts: {series.error.message}
        </p>
      ) : (
        <>
          <Section title="Users" note="Sign-ups per period, and all users to date.">
            <ChartCard title="New users" series={NEW_USERS}>
              <NewBars data={data} series={NEW_USERS} granularity={granularity} />
            </ChartCard>
            <ChartCard title="Total users" series={TOTAL_USERS}>
              <TotalLines data={data} series={TOTAL_USERS} granularity={granularity} />
            </ChartCard>
          </Section>

          <Section
            title="Subscriptions"
            note="Subscriptions started per period by billing interval, and started to date (cancellations aren't subtracted; the cards above show who's active now)."
          >
            <ChartCard title="New subscriptions" series={NEW_SUBS}>
              <NewBars data={data} series={NEW_SUBS} granularity={granularity} />
            </ChartCard>
            <ChartCard title="Subscriptions to date" series={TOTAL_SUBS}>
              <TotalLines data={data} series={TOTAL_SUBS} granularity={granularity} />
            </ChartCard>
          </Section>

          <DataTable data={data} series={TABLE_SERIES} granularity={granularity} />
        </>
      )}
    </div>
  );
}
