# OS Interiors — Website & Site-Operations ERP

A single repository containing two applications that ship together:

1. **A public marketing website** for OS Interiors, a commercial interior and
   turnkey fit-out contractor in Mumbai — home, services, portfolio, process,
   about and a contact form that files leads into the database.
2. **A small operations ERP** behind a login — an admin dashboard (leads,
   projects, employees, live site tracking) and an employee dashboard
   (GPS + selfie site-visit logging, expenses, offline queue).

Both are served from the same React single-page app; the ERP routes are
lazy-loaded so a marketing visitor never downloads them.

---

## Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 19, React Router 7, Vite 8, `vite-plugin-pwa` |
| UI extras | `react-hot-toast`, `recharts`, `react-leaflet` / Leaflet, `jspdf` + `jspdf-autotable` |
| Backend   | Node 18+, Express 5, Mongoose 9 (MongoDB) |
| Auth      | JWT (`jsonwebtoken`) + `bcryptjs`, 8-hour tokens |
| Hardening | `helmet`, `express-rate-limit`, field whitelisting, honeypot |
| Media     | Cloudinary (optional) for site-visit photos |
| Hosting   | Vercel (`vercel.json`) or Render (root `package.json` scripts) |

## Repository layout

```
.
├── README.md                 ← you are here
├── SECURITY.md               ← auth model, known exposures, outstanding actions
├── docs/                     ← detailed documentation (see index below)
├── package.json              ← root: Render build/start orchestration
├── vercel.json               ← Vercel build + rewrite rules
├── .env.example              ← required environment variables
├── visits.json               ← one-off exported dump of SiteVisit docs (not used at runtime)
├── test-visits.js            ← ad-hoc script that hits /api/v2/site-visits/all
├── backend/
│   ├── server.js             ← Express app: middleware, DB connect, route mounting
│   ├── middleware/auth.js    ← `auth` and `authAdmin` JWT guards
│   ├── models/               ← Mongoose schemas (User, Project, Lead, Attendance, SiteVisit, WorkReport)
│   ├── routes/               ← auth, admin, projects, leads, attendance, reports, siteVisits
│   ├── create-admin-user.js  ← create/reset a Super Admin
│   ├── create-sudarshan.js   ← create one specific demo employee
│   ├── seed-erp.js           ← ⚠️ wipes and re-seeds Users/Projects/Attendance
│   └── mock-db.js            ← in-memory MongoDB on :27017 for local work
└── frontend/
    ├── index.html            ← SEO meta, fonts, noscript reveal fallback
    ├── vite.config.js        ← React plugin + PWA manifest and precache rules
    ├── src/
    │   ├── main.jsx          ← installs the 401 axios interceptor, mounts <App/>
    │   ├── App.jsx           ← routing, lazy ERP chunks, scroll restoration
    │   ├── api/              ← API base URL + session/token helpers
    │   ├── components/       ← Navbar, Footer, Photo, RequireAuth, CustomCursor, …
    │   ├── data/             ← services, projects and business facts (content source of truth)
    │   ├── hooks/            ← useScrollReveal, useDocumentTitle
    │   └── pages/            ← marketing pages + AdminDashboard / EmployeeDashboard / Login
    └── public/               ← images (webp), sitemap.xml, robots.txt, legacy static scripts
```

## Documentation index

| Document | Covers |
|----------|--------|
| [docs/getting-started.md](docs/getting-started.md) | Prerequisites, install, environment variables, running locally, seeding |
| [docs/architecture.md](docs/architecture.md) | How the two apps fit together, request flow, routing, code splitting |
| [docs/api-reference.md](docs/api-reference.md) | Every HTTP endpoint: method, auth, body, responses |
| [docs/data-model.md](docs/data-model.md) | Mongoose schemas, fields, enums and relationships |
| [docs/frontend.md](docs/frontend.md) | Pages, components, hooks, content data files, PWA and SEO |
| [docs/deployment.md](docs/deployment.md) | Vercel and Render deployment, build commands, env config |
| [SECURITY.md](SECURITY.md) | Auth design, the past auth-bypass incident, credential rotation |

## Quick start

```bash
git clone https://github.com/sudaaher74-ctrl/new-interior-website.git
cd new-interior-website
cp .env.example .env            # then fill in MONGODB_URI and JWT_SECRET

# Terminal 1 — database (or point MONGODB_URI at Atlas / a local mongod)
node backend/mock-db.js

# Terminal 2 — API
cd backend && npm install && npm start

# Terminal 3 — web app
cd frontend && npm install && npm run dev   # http://localhost:5173
```

Create your first administrator:

```bash
cd backend
node create-admin-user.js you@osinteriors.in "a-long-random-password"
```

See [docs/getting-started.md](docs/getting-started.md) for the port caveat and
full details.
