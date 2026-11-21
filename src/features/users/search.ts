import { PAGE_SIZES } from "@/components/Pagination";

/** The Users page's URL search params: `?page=2&pageSize=50&search=gmail`. */
export interface UsersSearch {
  page: number;
  pageSize: number;
  search?: string;
}

export const DEFAULT_PAGE_SIZE = 25;

const positiveInt = (value: unknown) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

/** Parses the URL leniently: anything invalid falls back to the default. */
export function validateUsersSearch(raw: Record<string, unknown>): UsersSearch {
  const pageSize = positiveInt(raw.pageSize);
  const search = typeof raw.search === "string" && raw.search.trim() ? raw.search.trim() : undefined;
  return {
    page: positiveInt(raw.page) ?? 1,
    pageSize: pageSize && (PAGE_SIZES as readonly number[]).includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
    ...(search && { search }),
  };
}
