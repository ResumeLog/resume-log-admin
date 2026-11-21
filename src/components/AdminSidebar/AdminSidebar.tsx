import type { ComponentProps } from "react";
import SignOutIcon from "@/lib/foundations/icons/mono/signout.svg?react";
import { IconButton, NavItem, type NavItemProps } from "@/lib/components";
import { cn } from "@/lib/utils/cn";
import { Logo } from "../Logo";
import { navigationItems, type NavItemId } from "./navigation";

export type AdminSidebarProps = ComponentProps<"aside"> & {
  /** The navigation item for the current page. */
  selected: NavItemId;
  /** The signed-in admin's username, while it loads `undefined`. */
  username?: string;
  onSignOut: () => void;
  /** Renders navigation links with a router's link component. */
  linkComponent?: NavItemProps["linkComponent"];
};

/** A slimmer take on fe-v2's `AppSidebar`: logo, three links, and who's signed in. */
export function AdminSidebar({ selected, username, onSignOut, linkComponent, className, ...props }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[240px] shrink-0 flex-col overflow-clip border-r border-border-default bg-elevation-surface-sunken",
        className,
      )}
      {...props}
    >
      <div className="flex h-12 shrink-0 items-center gap-2 px-3 shadow-[0_1px_0_0_var(--color-border-default)]">
        <Logo />
        <span className="rounded-small bg-background-brand-subtle px-1-5 py-0-5 font-medium text-xxsmall leading-4 text-text-brand">
          Admin
        </span>
      </div>

      <nav aria-label="Main" className="flex-1 pt-3">
        <ul className="flex flex-col gap-px px-2">
          {navigationItems.map(({ id, label, href, Icon }) => (
            <li key={id}>
              <NavItem href={href} icon={<Icon />} selected={id === selected} linkComponent={linkComponent}>
                {label}
              </NavItem>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-t border-border-default pr-2 pl-4">
        <span className="min-w-[0] truncate font-medium text-small leading-5 tracking-tight text-text-default">
          {username ?? "…"}
        </span>
        <IconButton icon={<SignOutIcon />} aria-label="Sign out" title="Sign out" onClick={onSignOut} />
      </div>
    </aside>
  );
}
