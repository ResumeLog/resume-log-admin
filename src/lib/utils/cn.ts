import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const isSpacingStep = (value: string) => /^\d+(-\d+)?$/.test(value);

const merge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [isSpacingStep],
      radius: ["xsmall", "small", "medium", "large", "larger", "xlarge", "xxlarge", "full"],
      font: ["sans"],
      "font-weight": ["regular", "medium", "semibold"],
      text: ["xxsmall", "xsmall", "small", "medium", "large"],
      leading: [isSpacingStep],
      tracking: ["tighter", "tight", "wide"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
