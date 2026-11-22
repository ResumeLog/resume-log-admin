import { cva } from "class-variance-authority";

/** Shared by `Button` and anything that needs to look like one, such as a link. */
export const buttonStyles = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-large font-sans font-medium text-small leading-5 tracking-tight whitespace-nowrap disabled:cursor-default",
  {
    variants: {
      variant: {
        primary:
          "bg-background-primary enabled:hover:bg-background-primary-hover disabled:opacity-50 text-text-inverse shadow-[0_2px_4px_-2px_rgba(38,109,240,0.12),0_3px_6px_-2px_rgba(38,109,240,0.08),inset_0_0_0_1px_var(--color-border-subtle)]",
        secondary:
          "bg-elevation-surface enabled:hover:bg-elevation-surface-hover text-text-default shadow-[0_0_2px_0_rgba(28,40,64,0.18),0_1px_3px_0_rgba(0,0,0,0.04)]",
        ghost: "text-text-default enabled:hover:bg-neutral-alpha-4",
      },
      size: {
        small: "py-1",
        large: "py-1-5",
        xlarge: "py-2",
      },
      icons: {
        none: "",
        left: "",
        right: "",
        both: "",
      },
    },
    compoundVariants: [
      { size: "small", icons: "none", className: "px-2" },
      { size: "small", icons: "left", className: "pl-1-5 pr-2" },
      { size: "small", icons: "right", className: "pl-2 pr-1-5" },
      { size: "small", icons: "both", className: "px-1-5" },
      { size: "large", icons: "none", className: "px-2-5" },
      { size: "large", icons: "left", className: "pl-2 pr-2-5" },
      { size: "large", icons: "right", className: "pl-2-5 pr-2" },
      { size: "large", icons: "both", className: "px-2" },
      { size: "xlarge", icons: "none", className: "px-3" },
      { size: "xlarge", icons: "left", className: "pl-2-5 pr-3" },
      { size: "xlarge", icons: "right", className: "pl-3 pr-2-5" },
      { size: "xlarge", icons: "both", className: "px-2-5" },
    ],
  },
);
