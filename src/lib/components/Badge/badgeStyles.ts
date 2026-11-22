import { cva } from "class-variance-authority";

/** Shared by `Badge` and anything that needs to look like one, such as a clickable chip. */
export const badgeStyles = cva(
  "inline-flex items-center gap-1 rounded-small px-1-5 py-0-5 font-sans font-medium text-xsmall leading-4 whitespace-nowrap",
  {
    variants: {
      variant: {
        outline: "bg-elevation-surface text-text-default shadow-[inset_0_0_0_1px_var(--color-border-default)]",
        filled: "bg-background-subtle text-text-default",
        selected: "bg-neutral-1100 text-text-inverse",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);
