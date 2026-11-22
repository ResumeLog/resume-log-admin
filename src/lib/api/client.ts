// Adapted from resume-log-fe-v2's src/lib/api/client.ts.

export interface ApiConfig {
  baseUrl: string;
  getToken: () => string | null;
  /** Runs when a request made with a token gets a 401: the session has expired. */
  onUnauthorized: () => void;
}

type ErrorBody = { message?: string | string[] };

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

let config: ApiConfig | null = null;

export function configureApi(next: ApiConfig): void {
  config = next;
}

function messageOf(body: ErrorBody | null, fallback: string): string {
  const message = body?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message || fallback;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** Sent as JSON. */
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Calls the API and returns its JSON. Sends the admin's token and throws
 * `ApiError` on failure. A 401 on a request that sent a token also runs
 * `onUnauthorized`; a 401 without one (a wrong password) doesn't.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!config) throw new Error("configureApi must run before any API request");
  const { method = "GET", body, signal } = options;
  const token = config.getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const data = await readBody(response);
  if (response.ok) return data as T;

  if (response.status === 401 && token) config.onUnauthorized();
  const errorBody = typeof data === "object" ? (data as ErrorBody | null) : null;
  throw new ApiError(response.status, data, messageOf(errorBody, `${method} ${path} failed with ${response.status}`));
}
