import type { ComponentProps } from "react";
import ChevronLeftIcon from "@/lib/foundations/icons/mono/chevron-left.svg?react";
import { IconButton } from "@/lib/components";
import { controlStyles } from "@/lib/components/Input/controlStyles";
import { cn } from "@/lib/utils/cn";
import { PAGE_SIZES } from "./pageSizes";

export type PaginationProps = Omit<ComponentProps<"nav">, "onChange"> & {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
};

/** "1–25 of 726", rows per page, and previous / next page. */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  className,
  ...props
}: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 font-medium text-small leading-5 tracking-tight text-text-subtle",
        className,
      )}
      {...props}
    >
      <span className="tabular-nums" aria-live="polite">
        {first.toLocaleString()}–{last.toLocaleString()} of {total.toLocaleString()}
      </span>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={cn(controlStyles, "h-7 w-auto cursor-pointer py-[0] pr-6 tabular-nums")}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <span className="tabular-nums">
          Page {page.toLocaleString()} of {pages.toLocaleString()}
        </span>
        <div className="flex items-center">
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="Previous page"
            disabled={disabled || page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="disabled:opacity-40"
          />
          <IconButton
            icon={<ChevronLeftIcon className="rotate-180" />}
            aria-label="Next page"
            disabled={disabled || page >= pages}
            onClick={() => onPageChange(page + 1)}
            className="disabled:opacity-40"
          />
        </div>
      </div>
    </nav>
  );
}
