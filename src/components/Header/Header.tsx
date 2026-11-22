import type { ComponentProps, ReactNode } from "react";
import SidebarExpandIcon from "@/lib/foundations/icons/mono/sidebar-expand.svg?react";
import { cn } from "@/lib/utils/cn";

export type HeaderProps = Omit<ComponentProps<"header">, "title"> & {
  /** The current page's name. */
  title: string;
  /** 16×16 decorative icon before the title. */
  icon: ReactNode;
  /** Shows the expand button and handles its press. Pass it only while the sidebar is collapsed. */
  onToggle?: () => void;
};

export function Header({ title, icon, onToggle, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-[49px] shrink-0 items-center gap-2 border-b border-border-default px-3",
        className,
      )}
      {...props}
    >
      {onToggle && (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={onToggle}
          className="size-6 shrink-0 p-0-75 text-icon-default"
        >
          <SidebarExpandIcon aria-hidden />
        </button>
      )}
      <h1 className="flex items-center gap-1-5 pl-1 font-sans font-medium text-small leading-5 tracking-tight text-text-default">
        <span aria-hidden className="inline-flex size-4 shrink-0 text-icon-default">
          {icon}
        </span>
        {title}
      </h1>
    </header>
  );
}
