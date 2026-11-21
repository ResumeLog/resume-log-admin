import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { Granularity, TimeseriesPoint } from "./api";
import { bucketLabel, bucketTitle } from "./ranges";

export type SeriesKey = Exclude<keyof TimeseriesPoint, "bucket">;

export interface ChartSeries {
  key: SeriesKey;
  label: string;
  color: string;
}

const AXIS_TICK = { fill: "var(--color-text-subtle)", fontSize: 11 };
const GRID = "var(--color-border-default)";

function ChartTooltip({
  active,
  payload,
  label,
  granularity,
}: TooltipContentProps & { granularity: Granularity }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="flex flex-col gap-1 rounded-large bg-elevation-surface px-2-5 py-2 shadow-[0_4px_12px_-2px_rgba(24,41,75,0.16),0_0_0_1px_rgba(28,40,64,0.08)]">
      <span className="font-medium text-xsmall leading-4 text-text-subtle">
        {bucketTitle(String(label), granularity)}
      </span>
      {payload.map((entry) => (
        <span key={String(entry.dataKey)} className="flex items-center gap-2 text-small leading-5">
          <span aria-hidden className="h-0-5 w-3 rounded-full" style={{ background: entry.color }} />
          <strong className="font-semibold tabular-nums text-text-default">{Number(entry.value).toLocaleString()}</strong>
          <span className="text-text-subtle">{entry.name}</span>
        </span>
      ))}
    </div>
  );
}

function Legend({ series }: { series: ChartSeries[] }) {
  if (series.length < 2) return null;
  return (
    <ul className="flex gap-3">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1-5 font-medium text-xsmall leading-4 text-text-subtle">
          <span aria-hidden className="h-0-5 w-3 rounded-full" style={{ background: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/** A titled card with one chart. A single-series chart is named by its title alone. */
export function ChartCard({ title, series, children }: { title: string; series: ChartSeries[]; children: ReactNode }) {
  return (
    <figure className="flex min-w-[0] flex-1 flex-col gap-3 rounded-xlarge border border-border-default bg-elevation-surface p-4">
      <figcaption className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-small leading-5 tracking-tight text-text-default">{title}</span>
        <Legend series={series} />
      </figcaption>
      <div className="h-[220px]">{children}</div>
    </figure>
  );
}

interface PlotProps {
  data: TimeseriesPoint[];
  series: ChartSeries[];
  granularity: Granularity;
}

const xAxis = (granularity: Granularity) => (
  <XAxis
    dataKey="bucket"
    tickFormatter={(b: string) => bucketLabel(b, granularity)}
    tick={AXIS_TICK}
    tickLine={false}
    axisLine={{ stroke: GRID }}
    minTickGap={16}
  />
);

const yAxis = <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />;

/** New-per-bucket counts: thin bars rounded at the top, 2px apart within a group. */
export function NewBars({ data, series, granularity }: PlotProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={2} barCategoryGap="20%" margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="2 4" />
        {xAxis(granularity)}
        {yAxis}
        <Tooltip
          cursor={{ fill: "var(--color-background-selected)" }}
          content={(props) => <ChartTooltip {...props} granularity={granularity} />}
        />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={24} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Running totals: 2px lines with a crosshair. */
export function TotalLines({ data, series, granularity }: PlotProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="2 4" />
        {xAxis(granularity)}
        {yAxis}
        <Tooltip
          cursor={{ stroke: "var(--color-border-control)", strokeWidth: 1 }}
          content={(props) => <ChartTooltip {...props} granularity={granularity} />}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-elevation-surface)" }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
