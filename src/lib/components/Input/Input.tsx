import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";
import { controlStyles } from "./controlStyles";

export type InputProps = ComponentProps<"input">;

export function Input({ type = "text", className, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(controlStyles, "placeholder:text-text-subtle", className)}
      {...props}
    />
  );
}
