// Its own key, so it never mixes with the dashboard's `rl_token` on a shared origin.
const TOKEN_KEY = "rl_admin_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked: nothing to clear.
  }
}
