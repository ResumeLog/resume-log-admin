import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  /** 16×16 decorative icon. Should use `currentColor` so it follows the default and hover colors. */
  icon: ReactNode;
  /** Describes the action for screen readers, because the button has no visible label. */
  "aria-label": string;
};

export function IconButton({ icon, type = "button", className, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex size-7 cursor-pointer items-center justify-center rounded-large p-1-5 text-icon-subtle hover:bg-neutral-alpha-4 hover:text-text-default disabled:cursor-default aria-disabled:cursor-default",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="inline-flex size-4 shrink-0">
        {icon}
      </span>
    </button>
  );
}
