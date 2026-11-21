import type { ComponentProps, ComponentType, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type NavItemProps = ComponentProps<"a"> & {
  /** Where the item links to. */
  href: string;
  /** 16×16 decorative icon before the label. */
  icon: ReactNode;
  /** Marks this item as the current page. */
  selected?: boolean;
  /** Renders the link with a router's link component instead of a plain `<a>`. */
  linkComponent?: ComponentType<ComponentProps<"a">>;
};

export function NavItem({
  icon,
  selected = false,
  linkComponent: Link = "a" as unknown as ComponentType<ComponentProps<"a">>,
  className,
  children,
  ...props
}: NavItemProps) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={cn(
        "flex h-7 w-full items-center gap-1-5 rounded-large pl-2 pr-1 font-sans font-medium text-small leading-5 tracking-tight text-text-default",
        selected && "bg-background-selected",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="inline-flex size-4 shrink-0 text-icon-default">
        {icon}
      </span>
      {children}
    </Link>
  );
}
