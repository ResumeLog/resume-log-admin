import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { badgeStyles } from "./badgeStyles";


export type BadgeProps = ComponentProps<"span"> & {
  /** `outline` for neutral labels, `filled` for quieter ones, `selected` for the active one in a set. */
  variant?: "outline" | "filled" | "selected";
  /** A number after the label, such as "×4". */
  count?: ReactNode;
  /** A small red dot after the label, such as for something required. */
  dot?: boolean;
};

/** A short label, such as a keyword. */
export function Badge({ variant, count, dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ variant }), className)} {...props}>
      <BadgeContent variant={variant} count={count} dot={dot}>
        {children}
      </BadgeContent>
    </span>
  );
}

/** The inside of a badge, for elements styled with `badgeStyles`. */
export function BadgeContent({ variant, count, dot, children }: Pick<BadgeProps, "variant" | "count" | "dot" | "children">) {
  return (
    <>
      {children}
      {count !== undefined && (
        <span className={cn("font-regular tabular-nums", variant === "selected" ? "text-text-inverse/70" : "text-text-muted")}>
          {count}
        </span>
      )}
      {dot && <span aria-hidden className="size-1-5 shrink-0 rounded-full bg-status-red" />}
    </>
  );
}
