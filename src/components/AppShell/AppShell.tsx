import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type AppShellProps = ComponentProps<"div"> & {
  /** The docked sidebar. Leave empty while it's collapsed. */
  sidebar?: ReactNode;
  /** The page header. Empty when the page draws its own. */
  header?: ReactNode;
  /** Content floating over the left side of the page, such as the peek sidebar. */
  peek?: ReactNode;
  /** The page content. */
  children?: ReactNode;
};

export function AppShell({ sidebar, header, peek, children, className, ...props }: AppShellProps) {
  return (
    <div className={cn("relative flex h-dvh", className)} {...props}>
      {sidebar}
      <div className="flex min-w-[0] flex-1 flex-col">
        {header}
        <main className="flex min-h-[0] flex-1 flex-col">{children}</main>
      </div>
      {peek && <div className="absolute inset-y-[0] left-[0] z-10">{peek}</div>}
    </div>
  );
}
