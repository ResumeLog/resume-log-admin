/** The resume-log-be API, without a trailing slash. Set `VITE_API_URL` per environment (Vercel: Project → Settings → Environment Variables). */
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");
