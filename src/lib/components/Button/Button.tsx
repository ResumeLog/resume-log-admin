import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { buttonStyles } from "./buttonStyles";

function getIconPlacement(leftIcon: ReactNode, rightIcon: ReactNode) {
  if (leftIcon && rightIcon) return "both";
  if (leftIcon) return "left";
  if (rightIcon) return "right";
  return "none";
}

export type ButtonProps = ComponentProps<"button"> & {
  /** Visual style. Use one `primary` per view for the main action, `secondary` for supporting actions, and `ghost` for low-emphasis actions. */
  variant?: "primary" | "secondary" | "ghost";
  /** `small` is 28px high for dense UI such as toolbars, tables and cards. `large` is 32px high for forms, dialogs and page actions. `xlarge` is 36px high, like `large` with 2px more padding on every side. */
  size?: "small" | "large" | "xlarge";
  /** 16×16 decorative icon before the label. Should use `currentColor`. */
  leftIcon?: ReactNode;
  /** 16×16 decorative icon after the label, or a pair of small `Kbd` keys for a shortcut. Should use `currentColor`. */
  rightIcon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "small",
  leftIcon,
  rightIcon,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  const icons = getIconPlacement(leftIcon, rightIcon);

  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size, icons }), className)}
      {...props}
    >
      {leftIcon && (
        <span aria-hidden className="inline-flex size-4 shrink-0">
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span aria-hidden className="inline-flex h-4 min-w-4 shrink-0 items-center gap-1">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
