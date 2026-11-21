import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { setToken } from "./token";

export interface Admin {
  id: string;
  username: string;
}

export const meQueryKey = ["admin", "me"] as const;

/** The signed-in admin, from `GET /admin/auth/me`. */
export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: ({ signal }) => apiRequest<Admin>("/admin/auth/me", { signal }),
    staleTime: Infinity,
  });
}

/** Signs in with a username and password and stores the token. */
export function useLogin() {
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      apiRequest<{ token: string }>("/admin/auth/login", { method: "POST", body: credentials }),
    onSuccess: ({ token }) => setToken(token),
  });
}
