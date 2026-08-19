# API reference

Base URL: `/api` in production, `http://localhost:5005/api` in local
development (see `frontend/src/api/config.js`).

All authenticated endpoints expect:

```
Authorization: Bearer <jwt>
```

Tokens are issued by `POST /api/auth/login` and expire after **8 hours**. The
payload is `{ user: { id, role, fullName } }`.

**Auth column key**

| Marker | Meaning |
|--------|---------|
| — | Public, no token |
| `auth` | Any valid token |
| `authAdmin` | Token with role `Super Admin` or `Owner` |

---

## Authentication — `/api/auth`

### `POST /api/auth/login` — —

Rate-limited to **10 requests / 15 minutes** per address.

Request:
```json
{ "email": "you@osinteriors.in", "password": "…" }
```

Responses:
- `200` → `{ "token": "<jwt>", "user": { "id", "role", "fullName" } }`
- `400` → `{ "msg": "Email and password are required" }`
- `401` → `{ "msg": "Invalid credentials" }` — returned identically for an
  unknown address and a wrong password
- `429` → `{ "msg": "Too many login attempts, please try again later" }`

The email is lowercased and trimmed before lookup.

### `GET /api/auth/me` — `auth`

Returns `{ "user": { "id", "role", "fullName" } }` decoded from the token. Used
by `RequireAuth` and `verifySession()` to confirm a stored token is still valid.

---

## Leads — `/api/v2/leads` (alias `/api/leads`)

### `POST /api/v2/leads` — —

The public contact form. Rate-limited to **5 requests / hour** per address.

Request:
```json
{
  "name": "required, ≤120 chars",
  "phone": "required, ≤40 chars",
  "email": "optional, ≤160 chars",
  "projectType": "optional, ≤80 chars",
  "message": "optional, ≤4000 chars",
  "website": "honeypot — must be empty"
}
```

Behaviour:
- Fields are **whitelisted and truncated**; `status`, `source` and `notes`
  cannot be set by the caller.
- A non-empty `website` field is treated as a bot and answered with
  `200 { "ok": true }` **without saving**, so the bot gets no failure signal.
- `400` if `name` or `phone` is missing.
- `200` with the created lead document otherwise.

### `GET /api/v2/leads` — `authAdmin`

All leads, newest first (`sort: { createdAt: -1 }`).

### `PUT /api/v2/leads/:id/status` — `authAdmin`

Body `{ "status": "new" | "contacted" | "closed" }`. Returns the updated lead;
`404` if the id is unknown.

### `DELETE /api/v2/leads/:id` — `authAdmin`

Returns `{ "msg": "Lead removed" }`.

---

## Projects — `/api/v2/projects` (alias `/api/projects`)

### `POST /api/v2/projects` — `authAdmin`

Creates an ERP project from `req.body`. The `Project` schema is `strict: false`,
so extra fields are persisted as sent. Returns the created document.

### `GET /api/v2/projects` — `auth`

All projects, newest first. Used by both dashboards (the employee dashboard
needs the list to populate its project selector).

### `PUT /api/v2/projects/:id` — `authAdmin`

`findByIdAndUpdate` with `{ new: true }`; returns the updated document.

### `DELETE /api/v2/projects/:id` — `authAdmin`

---

## Admin — `/api/v2/admin`

Every route here is `authAdmin`.

### `GET /api/v2/admin/stats`

```json
{
  "totalProjects":   0,
  "activeProjects":  0,   // status === "Ongoing"
  "totalEmployees":  0,   // role === "Employee"
  "siteVisitsToday": 0    // SiteVisit.time >= local midnight
}
```

### `GET /api/v2/admin/site-visits`

Today's site visits, with `user` populated as `fullName`/`profilePhoto` and
`project` as `name`/`coordinates`.

### `GET /api/v2/admin/employees`

All users with role `Employee`, `password` excluded.

### `POST /api/v2/admin/employees`

Body: `{ fullName, email, password, mobileNumber, designation }`.

- Rejects a duplicate email with `400 { "msg": "User already exists" }`.
- Hashes the password with bcrypt (salt rounds 10).
- Assigns `employeeId` as `EMP` + zero-padded total user count + 1
  (e.g. `EMP004`). Note this is derived from a count, so deleting a user can
  cause a later collision with the schema's `unique` constraint.
- `designation` defaults to `Site Engineer`; role is forced to `Employee`.

### `PUT /api/v2/admin/employees/:id`

Partial update of `fullName`, `email`, `mobileNumber`, `designation`. Supplying
`password` re-hashes it. `404` if the id is unknown.

### `DELETE /api/v2/admin/employees/:id`

Returns `{ "msg": "Employee removed" }`.

---

## Site visits — `/api/v2/site-visits`

### `POST /api/v2/site-visits/log` — `auth`

Logs a GPS-stamped visit for the calling user.

```json
{
  "projectId": "…",
  "lat": 19.0057, "lng": 73.0319, "accuracy": 52,
  "photoBase64": "data:image/jpeg;base64,…",
  "photoUrl": "…",
  "expenseAmount": 0,
  "expenseDescription": ""
}
```

If `photoBase64` is present **and** `CLOUDINARY_CLOUD_NAME` is configured, the
image is uploaded to the Cloudinary folder `os_interior_visits` and the
`secure_url` is stored. Without Cloudinary configured, the base64 string is
stored on the document as-is.

### `GET /api/v2/site-visits/my-today` — `auth`

The calling user's visits since local midnight, newest first, `project`
populated with `name`.

### `GET /api/v2/site-visits/all` — `auth`

Every site visit ever recorded, `user` populated with `fullName`/`role` and
`project` with `name`/`title`. Backs the admin Live Tracking tab.

> ⚠️ This route uses `auth`, not `authAdmin` — any authenticated employee can
> read every visit, including other employees' locations and expenses.

---

## Attendance — `/api/v2/attendance`

### `GET /api/v2/attendance/today` — `auth`

The calling user's attendance record for today with `project` populated as
`name`, or `{ "status": "Not Checked In" }` when there is none.

### `POST /api/v2/attendance/check-in` — `auth`

```json
{ "projectId": "…", "lat": 0, "lng": 0, "accuracy": 0, "selfieUrl": "…", "deviceInfo": "…" }
```

- `404` if the project does not exist.
- **Geofence:** when the project has `coordinates`, the Haversine distance
  between the submitted position and the site is computed; beyond **100 m** the
  request is rejected with
  `400 { "msg": "You are not at the assigned site. Distance: <n>m" }`.
- `400 { "msg": "Already checked in today" }` on a second check-in.
- On success the record is saved with `status: "Present"` and returned.

### `POST /api/v2/attendance/check-out` — `auth`

Body `{ workSummary, progressPhotos }`.

- `400` if there is no check-in for today, or if already checked out.
- `totalWorkingHours` is computed from the check-in/check-out delta and stored
  to two decimal places.

---

## Work reports — `/api/v2/reports`

### `POST /api/v2/reports` — `auth`

```json
{
  "projectId": "…",
  "workCompleted": "required",
  "materialUsed": "…",
  "workersPresent": 0,
  "issuesFound": "…",
  "clientFeedback": "…",
  "tomorrowPlan": "…",
  "media": ["url", "…"]
}
```

### `GET /api/v2/reports` — `auth` + inline admin check

Returns all reports with `user` (`fullName`) and `project` (`name`) populated,
newest first. Non-admins receive `403 { "msg": "Not authorized" }`. The check is
written inline in the handler rather than using the shared `authAdmin` guard —
the effect is the same.

---

## Error conventions

- Auth failures return `401 { "msg": "No token, authorization denied" }` or
  `401 { "msg": "Token is not valid" }`.
- Role failures return `403 { "msg": "Access denied: administrators only" }`.
- Most handlers return `500` with the plain-text body `Server error`; anything
  that reaches the global error handler returns
  `500 { "msg": "Something went wrong on the server" }`. This inconsistency is
  pre-existing.
- On the client, **any** `401` from an axios call clears the session and
  redirects to `/login` (`installAuthInterceptor` in `src/api/session.js`).
