# Getting started

## Prerequisites

- **Node.js 18+** (the root `package.json` declares `"engines": { "node": ">=18.0.0" }`)
- **MongoDB** — a local `mongod`, MongoDB Atlas, or the bundled in-memory server
  (`backend/mock-db.js`, which uses `mongodb-memory-server`)

## Install

Dependencies live in two places. The root `postinstall` script installs both:

```bash
npm install          # runs: cd backend && npm install && cd ../frontend && npm install
```

Or install them individually:

```bash
cd backend  && npm install
cd frontend && npm install
```

## Environment variables

Copy `.env.example` to `backend/.env` (or the repo root — `dotenv.config()` is
called from `backend/server.js` and the helper scripts, so it resolves relative
to the process working directory).

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | **yes** | Mongoose connection string |
| `JWT_SECRET` | **yes** | Signing key for auth tokens. `middleware/auth.js` **throws on startup** if it is missing — there is deliberately no default |
| `PORT` | no | API port. Defaults to `5001` in `server.js`; `.env.example` suggests `5005` |
| `NODE_ENV` | no | When set to `production`, `server.js` skips `app.listen()` and only exports the app (Vercel serverless mode) |
| `CLOUDINARY_CLOUD_NAME` | no | Enables Cloudinary upload of site-visit photos |
| `CLOUDINARY_API_KEY` | no | Cloudinary credential |
| `CLOUDINARY_API_SECRET` | no | Cloudinary credential |

If the Cloudinary variables are absent, `routes/siteVisits.js` stores the
submitted base64 data URI directly on the document instead of a hosted URL.

### ⚠️ Port mismatch to be aware of

The frontend hardcodes the local API as `http://localhost:5005/api` (see
`frontend/src/api/config.js` and `frontend/public/api-config.js`), but
`backend/server.js` falls back to `5001` when `PORT` is unset. **Set `PORT=5005`
in your `.env`** (as `.env.example` does) or the dashboards will fail to reach
the API in development.

## Running locally

Three processes:

```bash
# 1. Database — skip if you have your own mongod or an Atlas URI
node backend/mock-db.js         # in-memory MongoDB on 127.0.0.1:27017, db "os-interiors"

# 2. API
cd backend && npm start         # node server.js

# 3. Frontend dev server
cd frontend && npm run dev      # Vite on http://localhost:5173
```

`.claude/launch.json` defines a `frontend` launch configuration that runs
`npm --prefix frontend run dev` on port 5173.

In development the Vite dev server serves the SPA and the browser calls the API
directly at `http://localhost:5005/api`. In production both are served from the
same origin and the base URL becomes the relative `/api`.

## Frontend scripts

| Command | Effect |
|---------|--------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `frontend/dist` |
| `npm run preview` | Serve the built output locally |
| `npm run lint` | ESLint over the project (flat config in `eslint.config.js`) |

## Backend scripts

| Command | Effect |
|---------|--------|
| `npm start` | `node server.js` |
| `npm run build` | No-op placeholder |
| `npm test` | **Not implemented** — exits 1. There is no test suite in this repository |

## Seeding and admin accounts

### Create or reset a Super Admin (recommended)

```bash
cd backend
node create-admin-user.js <email> <password> ["Full Name"]
```

Refuses passwords under 10 characters. Re-running against an existing address
resets that password and forces the `Super Admin` role.

### Seed demo ERP data

```bash
cd backend
node seed-erp.js
```

> ⚠️ **Destructive.** `seed-erp.js` runs `deleteMany({})` on the `User`,
> `ErpProject` and `Attendance` collections before inserting demo records with
> well-known passwords (`admin123`, `employee123`). Never run it against a
> production database.

### Create a single demo employee

```bash
cd backend
node create-sudarshan.js       # sudarshan@osinterior.com / sudarshan123
```

Also a development-only convenience — it hardcodes a weak password.

## Other loose files

- `test-visits.js` (repo root) — an ad-hoc axios script that GETs
  `/api/v2/site-visits/all` with a literal `dummy_admin_token`. It is a leftover
  from the period described in `SECURITY.md`; it will now correctly receive a
  401.
- `visits.json` (repo root) — a one-off JSON dump of `SiteVisit` documents,
  including base64 photo payloads. Nothing reads it at runtime.
- `frontend/convert.js` — converts `public/images/*.{jpg,jpeg,png}` to WebP via
  `sharp`.
- `frontend/replace.js`, `frontend/replace_reveal.js`, `frontend/replace_reveal.cjs`,
  `frontend/check_lazy.js` — one-shot codemods used during past refactors.
