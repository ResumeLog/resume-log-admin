import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { clearToken, useMe } from "@/features/auth";
import { AdminSidebar, findNavItem } from "./AdminSidebar";
import { AppShell } from "./AppShell";
import { Header } from "./Header";
import { RouterLink } from "./RouterLink";

/** The signed-in frame: sidebar, page header, and the current page. */
export function AdminLayout() {
  const { pathname } = useLocation();
  const current = findNavItem(pathname);
  const me = useMe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    clearToken();
    await navigate({ to: "/login", replace: true });
    queryClient.clear();
  };

  return (
    <AppShell
      sidebar={
        <AdminSidebar
          selected={current.id}
          username={me.data?.username}
          onSignOut={() => void signOut()}
          linkComponent={RouterLink}
        />
      }
      header={<Header title={current.label} icon={<current.Icon />} />}
    >
      <div className="min-h-[0] flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </AppShell>
  );
}
