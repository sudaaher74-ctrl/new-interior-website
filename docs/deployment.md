# Deployment

The repository is set up for two hosts. Both are configured in-tree; pick one.

## Vercel

The root `vercel.json` describes a two-build deployment:

```json
{
  "version": 2,
  "builds": [
    { "src": "backend/server.js", "use": "@vercel/node" },
    { "src": "package.json", "use": "@vercel/static-build",
      "config": { "distDir": "frontend/dist" } }
  ],
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/backend/server.js" },
    { "source": "/(.*\\.(?:js|css|svg|png|jpg|jpeg|gif|ico|txt|xml))", "destination": "/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- `backend/server.js` becomes a serverless function. Because
  `NODE_ENV === 'production'` on Vercel, `server.js` skips `app.listen()` and
  only exports the Express app — which is exactly what `@vercel/node` needs.
- The static build runs the root `build` script (`cd frontend && npm run build`)
  and publishes `frontend/dist`.
- The rewrite order matters: API first, then real static assets by extension,
  then the SPA fallback to `index.html` so client-side routes like
  `/portfolio/bombay-barbeque` resolve.

`backend/vercel.json` exists for deploying the backend directory on its own
(`cleanUrls`, plus `/api/(.*)` → `/server.js`).

### Environment variables to set in the Vercel project

- `MONGODB_URI`
- `JWT_SECRET` — **mandatory**; the app throws on startup without it
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  (optional; without them site-visit photos are stored inline as base64)

## Render (or any Node host)

The root `package.json` orchestrates it:

| Script | Command |
|--------|---------|
| `postinstall` | `cd backend && npm install && cd ../frontend && npm install` |
| `build` | `cd frontend && npm run build` |
| `start` | `cd backend && node server.js` |

So a Render web service needs **Build command** `npm install && npm run build`
and **Start command** `npm start`, with the same environment variables as above.
Leave `NODE_ENV` unset (or not `production`) if you need `server.js` to actually
call `app.listen()` — on a long-running host you do.

> Note the root `package.json` also lists the backend's runtime dependencies
> directly. That duplication exists so a host that only installs at the repo
> root still resolves Express and Mongoose.

## Serverless considerations

`server.js` calls `mongoose.connect()` at module load rather than per-request,
and every model is exported through `mongoose.models.X || mongoose.model(...)`.
Together these let a warm serverless container reuse its connection and avoid
"model already compiled" errors on re-invocation.

## Pre-deployment checklist

1. `JWT_SECRET` is a long random value — and a **new** one, given the exposure
   documented in [SECURITY.md](../SECURITY.md).
2. MongoDB Atlas password rotated; `MONGODB_URI` updated.
3. A Super Admin exists: `node backend/create-admin-user.js <email> <password>`.
4. `seed-erp.js` has **not** been run against the production database — it
   deletes all users, projects and attendance.
5. `frontend/src/data/business.js` reflects the live domain
   (`https://www.osinteriors.in`), and `index.html`'s canonical URL and
   `public/sitemap.xml` agree with it.
6. Consider the outstanding hardening items in `SECURITY.md` — CORS is currently
   open to all origins, and only the leads route validates its input.
