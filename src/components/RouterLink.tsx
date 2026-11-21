import type { ComponentProps } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";

/** Lets `NavItem` (which renders an `<a href>`) navigate through the router. */
export function RouterLink({ href, ...props }: ComponentProps<"a">) {
  return <Link to={href as LinkProps["to"]} {...props} />;
}
