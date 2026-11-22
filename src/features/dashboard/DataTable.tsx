import type { Granularity, TimeseriesPoint } from "./api";
import type { ChartSeries } from "./charts";
import { bucketTitle } from "./ranges";

/** The charts' numbers as a table, for screen readers and exact values. */
export function DataTable({
  data,
  series,
  granularity,
}: {
  data: TimeseriesPoint[];
  series: ChartSeries[];
  granularity: Granularity;
}) {
  return (
    <details className="group rounded-xlarge border border-border-default bg-elevation-surface">
      <summary className="cursor-pointer px-4 py-2-5 font-medium text-small leading-5 text-text-subtle hover:text-text-default">
        View as table
      </summary>
      <div className="max-h-[320px] overflow-auto border-t border-border-default">
        <table className="w-full text-left text-small leading-5">
          <thead className="sticky top-[0] bg-elevation-surface-sunken">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium text-text-subtle">
                Period
              </th>
              {series.map((s) => (
                <th key={s.key} scope="col" className="px-4 py-2 text-right font-medium text-text-subtle">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.bucket} className="border-t border-border-default">
                <th scope="row" className="px-4 py-1-5 font-medium text-text-default">
                  {bucketTitle(row.bucket, granularity)}
                </th>
                {series.map((s) => (
                  <td key={s.key} className="px-4 py-1-5 text-right tabular-nums text-text-default">
                    {row[s.key].toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
