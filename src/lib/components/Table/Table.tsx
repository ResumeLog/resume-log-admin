import { useRef, type ComponentProps, type ReactNode } from "react";
import PlusSmallIcon from "../../foundations/icons/mono/plus-small.svg?react";
import { cn } from "../../utils/cn";

const COLUMN = "w-[266px] min-w-[266px] max-w-[266px] last:w-[265px] last:min-w-[265px] last:max-w-[265px]";
const TEXT = "font-sans font-medium text-small leading-5 tracking-tight text-text-default";
const STICKY = "sticky left-[0] z-1 bg-elevation-surface in-data-scrolled:shadow-[4px_0_12px_0_rgba(0,0,0,0.1)]";
const DIVIDER = "border-r border-border-default last:border-r-0";
const SELECTED_TINT =
  "in-data-selected:bg-linear-to-r in-data-selected:from-background-primary/10 in-data-selected:to-background-primary/10";

export type TableProps = ComponentProps<"table">;

/**
 * Wraps a table so it scrolls both ways. Set `scrolled` when it's scrolled sideways,
 * so sticky columns show their shadow.
 */
export type TableScrollAreaProps = ComponentProps<"div"> & { scrolled?: boolean };

export function TableScrollArea({ scrolled = false, className, ...props }: TableScrollAreaProps) {
  return <div data-scrolled={scrolled || undefined} className={cn("overflow-auto", className)} {...props} />;
}

export function Table({ className, ...props }: TableProps) {
  return <table className={cn("border-separate border-spacing-[0] text-left", className)} {...props} />;
}

export type TableRowProps = ComponentProps<"tr"> & {
  /** Tints the row's cells brand blue at 10%. Check the row's checkbox at the same time. */
  isSelected?: boolean;
};

export function TableRow({ isSelected = false, ...props }: TableRowProps) {
  return <tr data-selected={isSelected || undefined} {...props} />;
}

export type TableHeaderCellProps = ComponentProps<"th"> & {
  /** 16 or 18px icon before the label, describing the column's type. */
  icon?: ReactNode;
  /** Keeps the column in view when the table scrolls sideways. */
  sticky?: boolean;
};

export function TableHeaderCell({ icon, sticky = false, className, children, ...props }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cn(
        COLUMN,
        TEXT,
        "h-10 border-y border-r border-border-default px-3 align-middle font-medium last:border-r-0",
        sticky && STICKY,
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-1-5">
        {icon && <span aria-hidden className="inline-flex shrink-0 text-icon-default">{icon}</span>}
        {children}
      </span>
    </th>
  );
}

export type TableCellVariant = "default" | "url" | "currency" | "status" | "checkbox";

/**
 * `active` outlines the cell in blue, as when it has keyboard focus. `focus` is editing: the cell widens
 * to 350px over the next one, with the blue outline, and its children should be a `TableCellInput`.
 * `error` outlines it in red, as when a save failed.
 */
export type TableCellState = "default" | "active" | "focus" | "error";

export type TableCellProps = ComponentProps<"td"> & {
  /** `currency` aligns right, `url` styles a link, `status` adds a dot, and `checkbox` adds a row checkbox. */
  variant?: TableCellVariant;
  state?: TableCellState;
  /** For `status` and `checkbox`: the dot or checkbox before the value. */
  leading?: ReactNode;
  /** Keeps the column in view when the table scrolls sideways. */
  sticky?: boolean;
};

const OUTLINE =
  "after:pointer-events-none after:absolute after:inset-x-[0] after:top-[0] after:bottom-px after:rounded-small after:border";

const STATE_STYLES: Record<TableCellState, string> = {
  default: "",
  active: cn(
    "before:pointer-events-none before:absolute before:inset-x-[0] before:top-[0] before:bottom-px before:bg-text-brand before:opacity-4",
    OUTLINE,
    "after:border-border-active",
  ),
  focus: "z-2",
  error: cn(OUTLINE, "after:border-border-danger"),
};

const CELL_PADDING: Record<TableCellVariant, string> = {
  default: "px-3",
  url: "px-3",
  currency: "px-3 text-right",
  status: "px-2",
  checkbox: "py-[0] pr-2 pl-4 align-middle",
};

export type TableSkeletonCellProps = Omit<ComponentProps<"td">, "children"> & {
  /** Width of the bar, in pixels. */
  width: number;
  /** Aligns the bar right, as in a currency column. */
  alignEnd?: boolean;
  sticky?: boolean;
};

export function TableSkeletonCell({ width, alignEnd = false, sticky = false, className, ...props }: TableSkeletonCellProps) {
  return (
    <td
      className={cn(
        COLUMN,
        DIVIDER,
        "h-[35px] border-b border-border-default bg-elevation-surface px-3 py-[0] align-middle leading-none",
        alignEnd && "text-right",
        sticky && STICKY,
        className,
      )}
      {...props}
    >
      <TableSkeleton width={width} />
    </td>
  );
}

function CellContent({ variant, leading, editing, children }: { variant: TableCellVariant; leading?: ReactNode; editing: boolean; children?: ReactNode }) {
  const value = editing ? <span className="flex min-w-[0] flex-1">{children}</span> : <span className="truncate">{children}</span>;
  if (variant === "status") {
    return (
      <span className="flex items-center gap-1 pr-1-5 pl-1">
        <span className="flex size-4 shrink-0 items-center justify-center">{leading}</span>
        {value}
      </span>
    );
  }
  if (variant === "checkbox") {
    return (
      <span className="flex items-center gap-2">
        {leading}
        {value}
      </span>
    );
  }
  return editing ? <span className="flex">{children}</span> : <span className="block truncate">{children}</span>;
}

export function TableCell({
  variant = "default",
  state = "default",
  leading,
  sticky = false,
  className,
  children,
  ...props
}: TableCellProps) {
  const editing = state === "focus";
  return (
    <td
      className={cn(
        COLUMN,
        TEXT,
        "relative border-b border-border-default bg-elevation-surface pt-2 pb-1-5 align-top",
        DIVIDER,
        SELECTED_TINT,
        CELL_PADDING[variant],
        STATE_STYLES[state],
        sticky && STICKY,
        sticky && editing && "z-3",
        className,
      )}
      {...props}
    >
      {editing ? (
        <span
          className={cn(
            "absolute top-[0] left-[0] h-[34px] w-[350px] bg-elevation-surface pt-2 pb-1-5",
            CELL_PADDING[variant],
            variant === "checkbox" && "flex items-center py-[0]",
            OUTLINE,
            "after:bottom-[0] after:border-border-active",
          )}
        >
          <CellContent variant={variant} leading={leading} editing>
            {children}
          </CellContent>
        </span>
      ) : (
        <CellContent variant={variant} leading={leading} editing={false}>
          {children}
        </CellContent>
      )}
    </td>
  );
}

export type TableCellInputProps = Omit<ComponentProps<"input">, "defaultValue" | "onBlur" | "onKeyDown"> & {
  /** The value when editing starts. The cursor starts after it, so typing adds to it. */
  defaultValue: string;
  /** Called once with the text, on Enter, Tab or when the input loses focus. */
  onCommit: (value: string) => void;
  /** Called on Esc. */
  onCancel: () => void;
};

/** The input of a cell in `state="focus"`. It takes the cell's text style. */
export function TableCellInput({ defaultValue, onCommit, onCancel, className, ...props }: TableCellInputProps) {
  const done = useRef(false);
  const finish = (action: () => void) => {
    if (done.current) return;
    done.current = true;
    action();
  };
  return (
    <input
      ref={(node) => {
        if (node && !done.current && document.activeElement !== node) {
          node.focus();
          node.setSelectionRange(node.value.length, node.value.length);
        }
      }}
      defaultValue={defaultValue}
      onBlur={(event) => finish(() => onCommit(event.currentTarget.value))}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === "Tab") {
          if (event.key === "Enter") event.preventDefault();
          const value = event.currentTarget.value;
          finish(() => onCommit(value));
        } else if (event.key === "Escape") {
          event.preventDefault();
          finish(onCancel);
        }
      }}
      className={cn(
        "h-5 w-full min-w-[0] bg-transparent p-[0] font-sans font-medium text-small leading-5 tracking-tight text-text-default outline-none [text-align:inherit]",
        className,
      )}
      {...props}
    />
  );
}

export type TableLinkProps = ComponentProps<"a">;

/** A link inside a `url` cell. */
export function TableLink({ className, ...props }: TableLinkProps) {
  return (
    <a
      className={cn("text-link-default underline decoration-border-control underline-offset-auto", className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  );
}

export type TableFooterCellProps = ComponentProps<"td"> & {
  /** Keeps the column in view when the table scrolls sideways. */
  sticky?: boolean;
};

export function TableFooterCell({ sticky = false, className, children, ...props }: TableFooterCellProps) {
  return (
    <td
      className={cn(COLUMN, TEXT, DIVIDER, "h-10 border-b border-border-default px-3 text-right align-middle", sticky && STICKY, className)}
      {...props}
    >
      {children}
    </td>
  );
}

/** "12 count": the number of rows, for the first footer cell. */
export function TableCount({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-1">
      <span>{count.toLocaleString()}</span>
      <span className="text-text-muted">count</span>
    </span>
  );
}

/** "Add calculation", shown in footer cells. It isn't designed to do anything yet, so it isn't a button. */
export function TableCalculation() {
  return (
    <span className="inline-flex items-center gap-1 text-text-subtle">
      <PlusSmallIcon aria-hidden className="shrink-0" />
      Add calculation
    </span>
  );
}

/** A gray bar standing in for a value while rows load. */
export function TableSkeleton({ width }: { width: number }) {
  return (
    <span
      aria-hidden
      style={{ width }}
      className="inline-block h-3 rounded-small bg-background-selected align-middle"
    />
  );
}
