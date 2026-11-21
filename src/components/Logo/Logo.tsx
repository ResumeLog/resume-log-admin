import type { ComponentProps } from "react";
import LogoIcon from "@/lib/foundations/icons/color/logo.svg?react";
import { cn } from "@/lib/utils/cn";

export type LogoProps = ComponentProps<"div">;

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-sans font-semibold text-medium leading-5 tracking-tighter text-text-default",
        className,
      )}
      {...props}
    >
      <LogoIcon aria-hidden className="shrink-0" />
      ResumeLog
    </div>
  );
}
