# Architecture

## The two applications

This repository holds one deployment containing two distinct products:

```
                       ┌──────────────────────────────────────┐
   Public visitor ───► │  Marketing site                      │
                       │  / /about /services /portfolio       │
                       │  /portfolio/:id /process /contact    │
                       │  Content from src/data/*.js (static) │
                       │  One API call: POST /api/leads       │
                       └──────────────────────────────────────┘
                                       │  same React bundle, same origin
                       ┌──────────────────────────────────────┐
   Staff (JWT)   ───►  │  Operations ERP (lazy-loaded)        │
                       │  /login /admin/* /employee/* /premium │
                       │  Talks to /api/v2/* on every render   │
                       └──────────────────────────────────────┘
                                       │
                                       ▼
                       ┌──────────────────────────────────────┐
                       │  Express API (backend/server.js)     │
                       │  helmet → cors → json → routers      │
                       └──────────────────────────────────────┘
                                       │  Mongoose
                                       ▼
                                   MongoDB
```

The marketing pages are entirely static content — the copy, service catalogue
and portfolio all live in `frontend/src/data/`, not in the database. The only
runtime dependency the public site has on the backend is the contact form.

## Request flow

### A public page load

1. Vercel's rewrite rules serve `index.html` for any non-asset path.
2. `main.jsx` installs a global axios 401 interceptor, then renders `<App/>`.
3. `App.jsx` matches the path against the marketing route group and renders
   `Navbar` → page → `Footer` → `WhatsAppButton`.
4. `useDocumentTitle` sets the per-route `<title>` and meta description (the app
   is one HTML document, so this is what differentiates pages for search).
5. `useScrollReveal` attaches an `IntersectionObserver` to `.reveal` elements —
   unless the OS reports `prefers-reduced-motion`, in which case everything is
   shown immediately.

### A dashboard page load

1. The route is wrapped in `<Lazily>` (`React.Suspense`) around a
   `React.lazy()` chunk, so the ERP code and the PDF stack are fetched only now.
2. `RequireAuth` reads the token from `localStorage`. No token → immediate
   redirect to `/login` carrying the intended path in router state.
3. With a token, it calls `GET /api/auth/me` before rendering anything. A
   failure clears the session and redirects.
4. `adminOnly` routes additionally check the role client-side and bounce
   non-admins to `/employee`.
5. The dashboard then issues its own `axios` calls with an
   `Authorization: Bearer <token>` header.

**The client-side guard is presentation only.** Every API route re-checks the
token and the role server-side; `RequireAuth` exists so users see a login screen
rather than a dashboard full of 401s.

### An API request

`backend/server.js` builds the middleware chain in this order:

1. `helmet()` — security headers. CSP is explicitly **disabled** so external
   CDNs (Leaflet tiles, Google Fonts) can load.
2. `cors()` — currently unrestricted; see `SECURITY.md`.
3. `express.json({ limit: '50mb' })` and `express.urlencoded` — the large limit
   exists because employee site visits post base64 photos in the JSON body.
4. `express.static('../frontend')` — serves legacy static files during local
   development.
5. Routers (see below).
6. A global error handler that logs the stack and returns a generic
   `{ msg: 'Something went wrong on the server' }` so traces never reach callers.

## Route mounting

| Mount point | Router |
|-------------|--------|
| `/api/auth` | `routes/auth.js` |
| `/api/v2/projects` | `routes/projects.js` |
| `/api/v2/leads` | `routes/leads.js` |
| `/api/v2/attendance` | `routes/attendance.js` |
| `/api/v2/reports` | `routes/reports.js` |
| `/api/v2/admin` | `routes/admin.js` |
| `/api/v2/site-visits` | `routes/siteVisits.js` |
| `/api/projects` | `routes/projects.js` (same router, legacy alias) |
| `/api/leads` | `routes/leads.js` (same router, legacy alias) |

The `/api/...` aliases exist for the pre-React static admin page. Note that
`server.js` mounts `/api/projects` **twice** with the same router — harmless,
since Express matches the first, but it is redundant. The Admin dashboard uses
`/api/v2/*` throughout, with one fallback to the legacy `/api/leads` if the v2
leads call fails.

## Authentication model

- `routes/auth.js` is the only place that issues tokens. It bcrypt-compares
  against the `User` collection and signs an 8-hour JWT with the payload
  `{ user: { id, role, fullName } }`.
- `middleware/auth.js` exports two guards:
  - `auth` — requires any valid token; attaches `req.user`.
  - `authAdmin` — as above plus a role in `['Super Admin', 'Owner']`.
- Login is rate-limited to 10 attempts per 15 minutes; the public lead form to
  5 per hour.
- Unknown email and wrong password return an identical `Invalid credentials`
  response so the endpoint cannot enumerate accounts.

Full detail, including the history of a previous auth-bypass, is in
[SECURITY.md](../SECURITY.md).

## Code splitting and the PWA

`App.jsx` lazy-loads `AdminDashboard`, `EmployeeDashboard`, `PremiumPage` and
`Login`. The dashboards pull in `jspdf`, `recharts` and Leaflet — roughly 1.3MB
of code that a marketing visitor has no use for.

`vite.config.js` protects that split: the Workbox `globIgnores` list excludes
the dashboard chunks, the PDF/HTML-to-canvas chunks and the legacy static
scripts from the service-worker precache. Without those exclusions the service
worker would download the whole ERP in the background on a marketing visit and
undo the splitting.

The PWA registers with `registerType: 'autoUpdate'` and ships a standalone
manifest (`OS Interiors`, theme `#f8fafc`, SVG favicon used for both `any` and
`maskable` purposes). `InstallPWA.jsx` surfaces the browser install prompt.

## Offline behaviour (employee dashboard)

The employee site-visit form is designed for use on a construction site with
patchy signal:

1. `navigator.onLine` drives an offline banner and a queue held in
   `localStorage` under `offlineVisits_queue`.
2. When offline, a submitted visit is pushed onto that queue and rendered
   optimistically in the visit list with an `isOffline` flag and a `local-…` id.
3. When the browser fires `online`, `syncOfflineQueue()` replays each queued
   payload against `POST /api/v2/site-visits/log`.

## Known rough edges

These are real characteristics of the current code, documented so they are not
rediscovered as surprises:

- `PORT` defaults to `5001` in `server.js` while the frontend hardcodes `5005`
  for local development. Set `PORT=5005`.
- `/api/projects` is mounted twice in `server.js`.
- `GET /api/v2/reports` performs its admin role check inline in the handler
  rather than using the shared `authAdmin` guard.
- `GET /api/v2/site-visits/all` — used by admin live tracking — is guarded by
  `auth`, not `authAdmin`, so any authenticated employee can read every visit.
- `POST /api/v2/projects` passes `req.body` straight into the model, and the
  `Project` schema is `{ strict: false }`, so callers can write arbitrary
  fields. Only administrators can reach it.
- There is no automated test suite; `npm test` in `backend/` exits 1.
