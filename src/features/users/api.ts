import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiRequest, type Paginated } from "@/lib/api";

/** A ResumeLog user, from `GET /admin/users`. */
export interface Customer {
  id: string;
  email: string;
  /** Join date (ISO). */
  createdAt: string;
  /** Current plan; the default (Free) plan when they have no subscription. */
  planName: string | null;
  interval: "month" | "year" | null;
}

export interface UsersQuery {
  page: number;
  pageSize: number;
  search?: string;
}

export function useUsers({ page, pageSize, search }: UsersQuery) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.set("search", search);
  return useQuery({
    queryKey: ["admin", "users", { page, pageSize, search }],
    queryFn: ({ signal }) => apiRequest<Paginated<Customer>>(`/admin/users?${params}`, { signal }),
    placeholderData: keepPreviousData,
  });
}
