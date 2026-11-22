/** A page of a list endpoint, such as `GET /admin/users?page=1&pageSize=25`. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** The largest page the API returns. */
export const MAX_PAGE_SIZE = 100;
