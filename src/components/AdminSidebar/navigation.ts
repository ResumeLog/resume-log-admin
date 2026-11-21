import type { ComponentType } from "react";
import PeopleIcon from "@/lib/foundations/icons/color/people.svg?react";
import DashboardIcon from "@/lib/foundations/icons/mono/dashboard.svg?react";
import PersonIcon from "@/lib/foundations/icons/mono/person.svg?react";

export type NavItemId = "dashboard" | "users" | "admins";

export type NavigationItem = {
  id: NavItemId;
  label: string;
  href: string;
  Icon: ComponentType;
};

/** Users are the app's customers; Admins are the accounts that can sign in here. */
export const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", Icon: DashboardIcon },
  { id: "users", label: "Users", href: "/users", Icon: PeopleIcon },
  { id: "admins", label: "Admins", href: "/admins", Icon: PersonIcon },
];

/** The item for a path: an exact match, or the item whose section the path is in. */
export function findNavItem(pathname: string): NavigationItem {
  return (
    navigationItems.find(({ href }) => href !== "/" && (pathname === href || pathname.startsWith(`${href}/`))) ??
    navigationItems[0]
  );
}
