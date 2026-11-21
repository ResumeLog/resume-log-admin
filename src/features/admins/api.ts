import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

/** An admin dashboard account, from `GET /admin/admin-users`. */
export interface AdminAccount {
  id: string;
  username: string;
  createdAt: string;
}

const adminsKey = ["admin", "admin-users"] as const;

export function useAdmins() {
  return useQuery({
    queryKey: adminsKey,
    queryFn: ({ signal }) => apiRequest<AdminAccount[]>("/admin/admin-users", { signal }),
  });
}

/** `POST /admin/admin-users`. 409 if the username is taken, 400 if it breaks the rules. */
export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { username: string; password: string }) =>
      apiRequest<AdminAccount>("/admin/admin-users", { method: "POST", body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKey }),
  });
}
