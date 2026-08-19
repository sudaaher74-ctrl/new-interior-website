# Frontend guide

Vite + React 19 single-page app in `frontend/`. One bundle serves both the
public marketing site and the internal ERP dashboards.

## Routing (`src/App.jsx`)

| Path | Component | Access |
|------|-----------|--------|
| `/` | `Home` | public |
| `/about` | `About` | public |
| `/services` | `Services` | public |
| `/portfolio` | `Portfolio` | public |
| `/portfolio/:id` | `ProjectDetail` | public |
| `/process` | `Process` | public |
| `/contact` | `Contact` | public |
| `/login` | `Login` (lazy) | public |
| `/admin/*` | `AdminDashboard` (lazy) | `RequireAuth adminOnly` |
| `/employee/*` | `EmployeeDashboard` (lazy) | `RequireAuth` |
| `/premium` | `PremiumPage` (lazy) | `RequireAuth` |

The marketing routes are nested inside a catch-all `*` route that supplies the
shared chrome: a "Skip to content" link, `Navbar`, a focusable
`#main-content` wrapper, `Footer` and `WhatsAppButton`. The dashboards sit
outside that chrome and render their own shells.

`ScrollToTop` restores scroll to the top on every navigation, unless the link
carried a hash — in which case it waits a tick (the target page may still be
mounting) and smooth-scrolls to that element.

## Session handling (`src/api/`)

`config.js` resolves the API base URL: `http://localhost:5005/api` on
`localhost`/`127.0.0.1`, otherwise the relative `/api`.

`session.js` owns everything token-related:

| Export | Purpose |
|--------|---------|
| `login(email, password)` | POSTs to `/auth/login`, stores `token` and `user` in `localStorage`, returns the user |
| `logout()` | Clears both keys |
| `getToken()` / `getUser()` | Read them back; `getUser` tolerates malformed JSON |
| `isAdmin(user)` | `role ∈ { Super Admin, Owner }` |
| `authHeaders()` | `{ Authorization: 'Bearer …' }`, or `{}` when signed out |
| `verifySession()` | Calls `GET /auth/me`; clears the session on a rejection, but **keeps** it on a network error — an offline blip is not proof of a bad token |
| `installAuthInterceptor()` | Global axios response interceptor: any `401` logs out and redirects to `/login`. Registered once in `main.jsx` before the first render |

`RequireAuth` (`src/components/RequireAuth.jsx`) renders a "Checking your
session…" state while `verifySession()` runs, then either the children, a
redirect to `/login` (carrying the intended path in router state so `Login` can
send the user back), or — for `adminOnly` routes reached by a non-admin — a
redirect to `/employee`.

## Content data (`src/data/`)

The marketing site's content is code, not CMS or database rows. Three modules:

- **`services.js`** — `SERVICE_CATEGORIES` and `CAPABILITIES`. Each entry has a
  number, title, slug, long `copy`, a `short` variant, display `chips` and a
  `projectType` value that matches the contact form's dropdown. The Services
  page renders all of it; Home, About, Process and Contact each take the slice
  they need, so the wording cannot drift between pages.
- **`projects.js`** — `FILTERS` (`All`, `Restaurants`, `Offices`, `Retail`,
  `Healthcare`, `Hospitality`) and the `projects` array backing both the
  portfolio grid and the detail page. Each project has a `slug` (the `:id` route
  param), category, sector, location, hero `img`, scope, status, a `delivered`
  list, prose `body` paragraphs and a `gallery`.
- **`business.js`** — canonical business facts (`BUSINESS`: name, url, phone,
  email, city, founded 2014, hours) plus the Schema.org `localBusinessSchema`
  (`@type: GeneralContractor`, with address, opening hours and an `OfferCatalog`
  built from the service data) and a `faqSchema(faqs)` helper.

Keeping these in one place is deliberate: the structured data, the footer and
the contact page all read from the same constants.

## Components

| Component | Role |
|-----------|------|
| `Navbar` | Six-link nav plus a "Request a quote" CTA. The mobile panel behaves like a dialog — Escape closes it, Tab is trapped inside, body scroll is locked, and it auto-closes on route change |
| `Footer` | Site links and business contact details from `business.js` |
| `Photo` | Cover-cropped image that never shifts layout. Holds a `DIMENSIONS` map of every file in `public/images`, passes intrinsic `width`/`height` so the browser reserves the box, and lazy-loads everything except the one image marked `priority` |
| `WhatsAppButton` | Floating `wa.me` link with a prefilled enquiry. Lives in the marketing layout, not `index.html`, so it does not hover over the dashboards |
| `StructuredData` | Injects a JSON-LD `<script>` into `<head>` for the current page and removes it on unmount |
| `CustomCursor` | Custom pointer on desktop only (disabled at ≤768px) |
| `InstallPWA` | Captures `beforeinstallprompt` and offers an install affordance |
| `RequireAuth` | Route guard, described above |

## Hooks

- **`useDocumentTitle(title, description)`** — sets `document.title` (suffixed
  with `— OS Interiors`) and updates the `meta[name=description]` tag. The app is
  a single HTML document, so without this every route would share one title,
  including in search results.
- **`useScrollReveal(deps)`** — observes `.reveal` / `.reveal-stagger` elements
  and adds `.is-visible` as they enter the viewport, unobserving after the
  one-way animation plays. It re-runs on route change and on any extra
  dependencies you pass — pass whatever adds or replaces revealed nodes (an
  active portfolio filter, for example) so newly mounted cards do not stay
  invisible. Honours `prefers-reduced-motion` by revealing everything at once.

`index.html` carries a `<noscript>` rule that forces `.reveal` elements back to
`opacity: 1`, so a script failure cannot leave the entire site blank.

## The dashboards

### Admin (`pages/AdminDashboard.jsx`, ~900 lines)

Five tabs driven by a single `activeTab` state value:

| Tab | Data source |
|-----|-------------|
| Dashboard | `GET /v2/admin/stats` |
| Live Tracking | `GET /v2/site-visits/all` (+ Leaflet map, per-employee filter) |
| Leads | `GET /v2/leads`, falling back to the legacy `GET /leads`; status updates via `PUT /v2/leads/:id/status` |
| Projects | full CRUD against `/v2/projects` |
| Employees | full CRUD against `/v2/admin/employees`, including a password-reset action |

It also offers CSV export and per-project PDF reports built with `jspdf` +
`jspdf-autotable` (date, employee, GPS, expense columns).

The API base URL here is read as `window.API_CONFIG?.BASE_URL || '/api'` —
supplied by the legacy `public/api-config.js` — rather than importing
`src/api/config.js`. Both resolve to the same value.

### Employee (`pages/EmployeeDashboard.jsx`, ~500 lines)

The site-visit logging flow:

1. Pick a project from `GET /projects`.
2. Open the device camera (`getUserMedia`), capture and optionally retake a
   photo; the frame is compressed to a base64 JPEG.
3. Optionally enter an expense amount and description.
4. On submit, acquire a high-accuracy GPS fix (`enableHighAccuracy`, 10s
   timeout) and POST everything to `/v2/site-visits/log`.
5. Today's visits are listed from `GET /v2/site-visits/my-today`.

**Offline support:** an `online`/`offline` listener drives a warning banner. When
offline, the payload is appended to `localStorage['offlineVisits_queue']` and
shown optimistically in the list with a `local-…` id and an `isOffline` flag.
When connectivity returns, `syncOfflineQueue()` replays each queued payload
against the API.

### `PremiumPage`

A standalone "Aura." design showcase page behind `RequireAuth`. It is not part
of the marketing site and its internal nav links (`/projects`) do not correspond
to real routes — treat it as a design mock-up.

## Styling

- `src/assets/style.css` — the global design system for the marketing site
  (monochrome tokens, layout, reveal animations).
- CSS Modules for anything dashboard-shaped: `AdminDashboard.module.css`,
  `EmployeeDashboard.module.css`, `Login.module.css`, `PremiumPage.module.css`.
- `src/assets/admin.css` is legacy global CSS from the pre-React admin page. It
  is deliberately **not** imported by `App.jsx` — it clobbered the site's own
  tokens.
- Typography is Plus Jakarta Sans, loaded from Google Fonts with `preconnect`
  hints in `index.html`.

## PWA and SEO

- `vite-plugin-pwa` with `registerType: 'autoUpdate'`. The Workbox `globIgnores`
  list keeps the dashboard chunks, the PDF/canvas chunks and the legacy static
  scripts out of the precache — see [architecture.md](architecture.md#code-splitting-and-the-pwa).
- Manifest: name `OS Interiors`, `display: standalone`, theme and background
  `#f8fafc`, `/favicon.svg` used for both the `any` and `maskable` icon purposes.
- `index.html` carries the full SEO head: title, description, canonical URL,
  robots directives, Open Graph and Twitter card tags.
- `public/sitemap.xml` and `public/robots.txt` are served as-is.
- JSON-LD is injected per page through `StructuredData`.

## Legacy files in `public/`

`script.js` and `admin.js` are the JavaScript of the original static,
pre-React site. They are no longer loaded by the app and are explicitly excluded
from the service-worker precache. `api-config.js` **is** still used — the admin
dashboard reads `window.API_CONFIG`.
