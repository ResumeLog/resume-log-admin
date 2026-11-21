import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Pagination } from "@/components/Pagination";
import SearchIcon from "@/lib/foundations/icons/mono/search.svg?react";
import {
  Badge,
  Input,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableScrollArea,
  TableSkeletonCell,
} from "@/lib/components";
import { formatDate } from "@/lib/utils/format";
import { useUsers, type Customer } from "./api";
import type { UsersSearch } from "./search";

const INTERVAL_LABEL = { month: "Monthly", year: "Yearly" } as const;
const SEARCH_DEBOUNCE_MS = 300;

function PlanCell({ user }: { user: Customer }) {
  return (
    <TableCell>
      <span className="flex items-center gap-1-5">
        {user.planName ?? "—"}
        {user.interval && <Badge variant="filled">{INTERVAL_LABEL[user.interval]}</Badge>}
      </span>
    </TableCell>
  );
}

export function UsersPage() {
  const search = useSearch({ from: "/authed/users" });
  const navigate = useNavigate({ from: "/users" });
  const users = useUsers(search);
  const [query, setQuery] = useState(search.search ?? "");

  const setSearch = useCallback(
    (next: Partial<UsersSearch>) => void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true }),
    [navigate],
  );

  // Debounce typing into the URL; a new search starts at page 1.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === (search.search ?? "")) return;
    const timer = setTimeout(() => setSearch({ search: trimmed || undefined, page: 1 }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search.search, setSearch]);

  // A page past the end (e.g. after narrowing the search) snaps to the last page.
  const total = users.data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / search.pageSize));
  useEffect(() => {
    if (users.data && search.page > lastPage) setSearch({ page: lastPage });
  }, [users.data, lastPage, search.page, setSearch]);

  const rows = users.data?.items ?? [];
  const loading = users.isPending;

  return (
    <div className="flex w-full flex-col gap-4 p-4 min-[640px]:p-6">
      <div className="relative w-full max-w-[320px]">
        <SearchIcon aria-hidden className="pointer-events-none absolute top-2 left-2 size-4 text-icon-subtle" />
        <Input
          type="search"
          aria-label="Search by email"
          placeholder="Search by email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-7"
        />
      </div>

      {users.isError ? (
        <p role="alert" className="rounded-xlarge border border-border-danger p-4 text-small text-text-danger">
          Couldn't load users: {users.error.message}
        </p>
      ) : (
        <div className="flex flex-col overflow-clip rounded-xlarge border border-border-default">
          <TableScrollArea>
            <Table aria-label="Users" aria-busy={users.isFetching} className="w-full">
              <thead>
                <tr>
                  <TableHeaderCell className="border-t-0">Email</TableHeaderCell>
                  <TableHeaderCell className="border-t-0">Joined</TableHeaderCell>
                  <TableHeaderCell className="border-t-0">Current plan</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 8 }, (_, i) => (
                    <tr key={i}>
                      <TableSkeletonCell width={180} />
                      <TableSkeletonCell width={90} />
                      <TableSkeletonCell width={70} />
                    </tr>
                  ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-10 text-center text-small text-text-subtle">
                      {search.search ? `No users match “${search.search}”.` : "No users yet."}
                    </td>
                  </tr>
                )}
                {rows.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell title={user.email}>{user.email}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <PlanCell user={user} />
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableScrollArea>
          <Pagination
            className="px-3 py-2"
            page={search.page}
            pageSize={search.pageSize}
            total={total}
            disabled={loading}
            onPageChange={(page) => setSearch({ page })}
            onPageSizeChange={(pageSize) => setSearch({ pageSize, page: 1 })}
          />
        </div>
      )}
    </div>
  );
}
