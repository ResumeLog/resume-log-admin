import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { getToken, LoginPage } from "@/features/auth";
import { UsersPage } from "@/features/users/UsersPage";
import { validateUsersSearch } from "@/features/users/search";

export interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (getToken()) throw redirect({ to: "/", replace: true });
  },
  component: LoginPage,
});

/** Every page but /login, inside the sidebar layout. Without a token, go sign in. */
const authedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authed",
  beforeLoad: () => {
    if (!getToken()) throw redirect({ to: "/login", replace: true });
  },
  component: AdminLayout,
});

const placeholder = (name: string) => () => <p className="p-6 text-small text-text-subtle">{name}</p>;

const dashboardRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "/",
  // Lazy: recharts is most of the bundle, and only this page needs it.
  component: lazyRouteComponent(() => import("@/features/dashboard/DashboardPage"), "DashboardPage"),
});

const usersRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "/users",
  validateSearch: validateUsersSearch,
  component: UsersPage,
});

const adminsRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "/admins",
  component: placeholder("Admins"),
});

const routeTree = rootRoute.addChildren([loginRoute, authedRoute.addChildren([dashboardRoute, usersRoute, adminsRoute])]);

export function createAppRouter(context: RouterContext) {
  return createRouter({ routeTree, context, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
