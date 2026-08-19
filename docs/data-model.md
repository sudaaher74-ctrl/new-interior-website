# Data model

Six Mongoose models in `backend/models/`. Every one is exported through the
`mongoose.models.X || mongoose.model('X', Schema)` guard (except `Lead`), which
prevents "model already compiled" errors when the module is required more than
once — the pattern a serverless deployment needs.

## Collections at a glance

```
User ──assignedSites──►  ErpProject
  ▲                          ▲
  │                          │
  ├── Attendance ────────────┤
  ├── SiteVisit ─────────────┤
  └── WorkReport ────────────┘

Lead   (standalone — public contact form)
```

---

## `User` — model `User`

The only collection the login route authenticates against.

| Field | Type | Notes |
|-------|------|-------|
| `employeeId` | String | required, **unique**. Generated as `EMP` + padded count by the admin create route |
| `fullName` | String | required |
| `email` | String | required, **unique**. Lowercased/trimmed at login lookup |
| `password` | String | required, bcrypt hash |
| `mobileNumber` | String | required |
| `designation` | String | e.g. `Site Engineer` |
| `department` | String | |
| `role` | String | enum `Super Admin` \| `Owner` \| `Project Manager` \| `Site Supervisor` \| `Employee`, default `Employee` |
| `assignedSites` | [ObjectId → `ErpProject`] | |
| `profilePhoto` | String | URL |
| `createdAt` | Date | default now |

Only `Super Admin` and `Owner` pass `authAdmin`. `Project Manager` and
`Site Supervisor` exist in the enum but currently carry the same permissions as
`Employee`.

---

## `Project` — model **`ErpProject`**

Note the model name differs from the file name; references elsewhere use
`ref: 'ErpProject'`.

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required |
| `clientName` | String | |
| `siteAddress` | String | |
| `coordinates.lat` / `.lng` | Number | drives the attendance geofence and map markers |
| `budget` | String | stored as text, not a number |
| `startDate` / `endDate` | Date | |
| `status` | String | enum `Planning` \| `Ongoing` \| `On Hold` \| `Completed` \| `Upcoming`, default `Planning` |
| `createdAt` | Date | default now |

Declared with **`{ strict: false }`**, so any additional field sent to
`POST /api/v2/projects` is persisted. Some records carry a `title` field for
this reason — `GET /api/v2/site-visits/all` populates both `name` and `title`,
and the employee dashboard reads `project.title || project.name`.

---

## `Lead`

Written by the public contact form; read and managed by administrators.

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required |
| `phone` | String | required |
| `email` | String | |
| `projectType` | String | matches the `projectType` values in `frontend/src/data/services.js` |
| `message` | String | |
| `source` | String | default `Website Form` |
| `status` | String | enum `new` \| `contacted` \| `closed`, default `new` |
| `notes` | [{ `text`, `system`, `date` }] | no route writes to this today |
| `createdAt` | Date | default now |

`source`, `status` and `notes` are deliberately **not** settable by the public
endpoint — it whitelists the five content fields.

---

## `Attendance`

One document per user per day.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → `User` | required |
| `project` | ObjectId → `ErpProject` | |
| `date` | Date | required, default now. Queried as `>= local midnight` |
| `checkIn.time` | Date | |
| `checkIn.location` | `{ lat, lng, accuracy }` | validated against the project geofence |
| `checkIn.selfieUrl` | String | |
| `checkIn.deviceInfo` | String | |
| `checkOut.time` | Date | |
| `checkOut.workSummary` | String | |
| `checkOut.progressPhotos` | [String] | |
| `status` | String | enum `Present` \| `Absent` \| `Late Arrival` \| `Early Departure` \| `Half Day`, default `Absent` |
| `totalWorkingHours` | Number | computed on check-out |
| `createdAt` | Date | default now |

Only `Present` is ever set by the API; the other enum values are reserved for
future use.

---

## `SiteVisit`

The core record of the employee dashboard — a GPS-and-photo proof of presence,
with an optional expense claim attached.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → `User` | required |
| `project` | ObjectId → `ErpProject` | required |
| `time` | Date | required, default now |
| `location` | `{ lat, lng, accuracy }` | |
| `photoUrl` | String | a Cloudinary `secure_url`, or historically a base64 data URI |
| `expenseAmount` | Number | default 0 |
| `expenseDescription` | String | |
| `createdAt` | Date | default now |

Older documents store the photo inline as base64, which is why
`express.json` is configured with a `50mb` limit. `visits.json` in the repo root
is an export containing such records.

---

## `WorkReport`

The daily site report.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → `User` | required |
| `project` | ObjectId → `ErpProject` | required |
| `date` | Date | required, default now |
| `workCompleted` | String | required |
| `materialUsed` | String | |
| `workersPresent` | Number | |
| `issuesFound` | String | |
| `clientFeedback` | String | |
| `tomorrowPlan` | String | |
| `media` | [String] | URLs for images, video, documents |
| `createdAt` | Date | default now |

---

## Marketing content is *not* in the database

The portfolio, service catalogue and business facts shown on the public site are
static JavaScript modules under `frontend/src/data/` — `projects.js`,
`services.js` and `business.js`. The `ErpProject` collection is internal
operations data and is unrelated to the portfolio. See
[frontend.md](frontend.md).
