# resume-log-admin

Internal admin dashboard for ResumeLog. Admins sign in with a username and
password (no Google, no password reset) and can see:

- **Dashboard**: total users and active monthly / yearly subscriptions, plus
  charts of new sign-ups and new subscriptions per day, week or month with
  running totals.
- **Users**: every ResumeLog user with their email, join date and current
  plan. Paginated and searchable by email.
- **Admins**: who can sign in here, and a form to create another admin.

It talks to [`resume-log-be`](../resume-log-be) (the `/admin/*` endpoints,
RES-37) and copies the look of [`resume-log-fe-v2`](../resume-log-fe-v2).

**Stack:** Vite 8, React 19, TypeScript 7, Tailwind v4, TanStack Router and
Query, and recharts. Linted with oxlint.

## Run locally

Needs Node 22 (`nvm use`) and a running `resume-log-be`.

```sh
cp .env.example .env    # VITE_API_URL, default http://localhost:3000
npm install
npm run dev             # http://localhost:5173
```

The first admin has to be created on the backend. Only an admin can create
admins from the dashboard.

```sh
cd ../resume-log-be
npm run admin:create -- <username> <password>
```

The backend also needs `ADMIN_JWT_SECRET` set. It signs admin tokens, it must
be different from `JWT_SECRET`, and the API won't start without it.

Other scripts:

- `npm run build`: type-check and build into `dist/`
- `npm run lint`: oxlint
- `npm run preview`: serve the build

## Deploy (Vercel)

1. Import this repository in Vercel. `vercel.json` sets the Vite preset, the
   build command, the `dist` output, an SPA rewrite (so `/users` survives a
   refresh) and `noindex` / anti-framing headers.
2. Under **Settings → Environment Variables**, set `VITE_API_URL` to the
   production API URL, with no trailing slash. It's read at build time, so
   redeploy after changing it.
3. The API currently allows any origin (CORS). If that's ever locked down to an
   allowlist, add this dashboard's domain to it.

## Theme

Visual parity with fe-v2 comes from copying, not a shared package:

- `src/lib/foundations/tokens/generated/*.css` are fe-v2's **generated**
  design tokens. Don't edit them here. To pick up token changes, copy them
  again from `resume-log-fe-v2/src/lib/foundations/tokens/generated/`.
- `src/lib/components/*` and `src/components/{AppShell,Header,Logo}` are
  copies of fe-v2's components, without their stories.
- Chart colors are in `src/features/dashboard/series.ts`. Monthly is always the
  brand blue and yearly a darker orange. The pair was checked for color-blind
  separation and 3:1 contrast.

## Layout

```
src/
  config.ts             VITE_API_URL
  router.tsx            /login, plus a guarded layout for /, /users, /admins
  lib/api/              fetch wrapper (bearer token, ApiError), Paginated type
  components/           AdminLayout, AdminSidebar, Pagination, + fe-v2 copies
  features/auth/        login page, token (localStorage "rl_admin_token"), useMe
  features/dashboard/   cards, filters, charts (lazy-loaded route)
  features/users/       users table; page / pageSize / search live in the URL
  features/admins/      admins table, create-admin dialog
```

A 401 on any request made with a token signs the admin out and goes to
`/login`. Admin tokens last 12 hours.
