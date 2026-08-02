# Security Notes for OS Interiors

## Authentication

Every API route is authenticated with a signed JWT. The middleware lives in one
place, `backend/middleware/auth.js`:

- `auth` — requires any valid token.
- `authAdmin` — additionally requires the `Super Admin` or `Owner` role.

`backend/routes/auth.js` is the only place that issues tokens. It bcrypt-compares
against the `User` collection, signs an 8-hour JWT, and rate-limits login to 10
attempts per 15 minutes per address. Unknown addresses and wrong passwords return
the identical `Invalid credentials` response so the endpoint cannot be used to
discover which accounts exist.

On the frontend, `/admin`, `/employee` and `/premium` sit behind
`RequireAuth`, which validates the stored token against `GET /api/auth/me`
before rendering. An axios interceptor clears the session and redirects to
`/login` on any 401, so an expired token cannot leave a dashboard half-working.

**The route guard is a convenience, not the control.** The server enforces
authorisation independently on every request.

### Creating the first administrator

```
cd backend
node create-admin-user.js you@osinteriors.in "a-long-random-password"
```

Re-running it against an existing address resets that password and ensures the
Super Admin role. (`setup-admin.js` is obsolete — it wrote to a separate `Admin`
collection that nothing reads.)

`JWT_SECRET` **must** be set. `middleware/auth.js` throws on startup rather than
falling back to a default, because a predictable secret lets anyone mint an
admin token.

### History

A `bypass-auth.js` script previously rewrote every auth middleware into a stub
that granted Super Admin to all callers, and the dashboards wrote their own
`dummy_admin_token` into localStorage. For a period the entire API — including
every lead's name, phone and email — was readable by anyone. That script has
been deleted and the middleware restored. Assume any data held during that
window was exposed.

## Public contact form

`POST /api/leads` is the one unauthenticated write. It is protected by a
5-per-hour rate limit, a `website` honeypot field (a filled honeypot returns a
silent `200` so bots get no feedback), required name and phone, and an explicit
field whitelist — callers cannot set `status`, `source` or `notes` themselves.

## Other measures

- **Helmet** for secure HTTP headers.
- **Global error handler** so stack traces are not returned to callers.
- **.gitignore** covering `.env` and `node_modules`.

## ⚠️ Action still required

`.env` was previously committed and pushed, so **the database credentials and
JWT secret in it are compromised.**

1. **Rotate the MongoDB Atlas password** and update `MONGODB_URI`.
2. **Set a new long random `JWT_SECRET`.** This also invalidates every token
   issued under the old secret, which is what you want.
3. **Scrub git history** with [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
   or `git filter-branch` — the old values are still in past commits.

## Future recommendations

- **HTTPS** in production.
- **Input validation** with `joi` or `express-validator` across the ERP routes;
  only the leads route whitelists its fields today.
- **CORS**: `server.js` currently allows all origins. Restrict it to the
  production domain.
- **Password policy**: the login route does not enforce complexity on existing
  accounts; only `create-admin-user.js` sets a 10-character floor.
