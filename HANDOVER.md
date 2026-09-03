# OS Interiors — Project Handover & Technical Documentation

Welcome to the **OS Interiors Platform** technical handover guide. This document contains all essential information required for operating, maintaining, configuring, and extending the website and internal ERP portal.

---

## 1. System Architecture & Tech Stack

The platform is structured into two interconnected tiers:

1. **Client-Facing Architectural Website & Progressive Web App (PWA)**
   - **Framework**: React 18 + Vite
   - **Styling**: Vanilla CSS Modules (luxury editorial design system, dark-mode ambient lighting, fluid responsive layout)
   - **Routing**: `react-router-dom` with code-splitting (`React.lazy`)
   - **Icons & Media**: WebP optimized imagery, Leaflet interactive maps, Lucide/SVG assets
   - **PWA**: Configured with Service Worker for installability on Android, iOS, and Desktop

2. **Backend REST API & Internal ERP System**
   - **Runtime**: Node.js & Express (v5.x)
   - **Database**: **Supabase (PostgreSQL)** for scalable real-time cloud data storage
   - **File Storage**: Cloudinary integration with base64 graceful fallback
   - **Authentication**: Stateless JSON Web Tokens (JWT) with bcrypt hashing & Google OAuth 2.0
   - **Security**: Granular Role-Based Access Control (RBAC), Helmet HTTP headers, IP-based brute force protection, honeypot spam traps on public lead forms

---

## 2. Portals & Application URLs

| Interface | URL Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Marketing Website** | `/` | Public | Luxury commercial & residential interior design portfolio, services, process, and quote requests. |
| **Authentication** | `/login` | Public | Secure unified login with email/password and Google Single Sign-On (SSO). |
| **Admin ERP Dashboard** | `/admin` | Super Admin, Owner, Admin | Full management hub for leads, site engineers, attendance logs, expenses, projects, and CMS. |
| **Site Employee Portal** | `/employee` | Employee, Site Engineer, PM | Mobile-first engineer portal for GPS site visits, photo verification, attendance check-in, expenses, and leave requests. |
| **Premium Client Showcase** | `/premium` | Authenticated Clients | High-end presentation area for clients. |

---

## 3. Key Modules & Features

### 🏢 3.1 Admin ERP Dashboard (`/admin`)
- **Executive Analytics**: Real-time project counts, active site visits today, total expenses, and 7-day trend visual graphs (Recharts).
- **Live Site Tracking**: GPS map displaying all field engineer site visits with geolocation coordinates and verified photos.
- **Leads CRM Kanban**: Visual sales pipeline (New → Contacted → Converted → Closed) with CSV export and lead notes.
- **Project Tracking**: Multi-project tracking (Planning, Ongoing, On Hold, Completed) with budget and client attribution.
- **Attendance & Monthly Reports**: Filterable attendance logs with automated **one-click professional PDF report generator** (`jsPDF-AutoTable`) detailing days present, hours worked, and travel expenses per employee.
- **Leave Management**: View, approve, or reject employee leave requests with custom admin notes.
- **Expense Claim Approvals**: Travel expense reimbursement pipeline with status tracking (Pending/Approved/Rejected).
- **Portfolio CMS**: Create, update, preview, and delete commercial and residential portfolio projects directly from the dashboard.
- **Blog CMS**: Content authoring tool for articles with tag management, cover images, and draft/publish workflows.
- **Real-Time Notifications (`NotificationBell`)**: Instant notifications for site visits, leaves, and expenses.

### 👷 3.2 Site Employee Portal (`/employee`)
- **Daily Attendance**: One-tap check-in and check-out with automatic hours calculation.
- **GPS Verified Photo Reports**: Field photo capture with live geolocation coordinates and accuracy metadata.
- **Travel Expense Claims**: Claim expenses directly alongside site photos with real-time status feedback.
- **Leave Applications**: Submit leave requests with reason and multi-day datepicker.
- **Offline Sync Queue**: Automatically caches visits locally if cellular connectivity drops on site, syncing once connection is restored.

---

## 4. Environment Variables (`.env`)

Configure these variables in your hosting dashboard (e.g. **Vercel** or server environment):

```env
# Server Runtime
PORT=5005
NODE_ENV=production

# Supabase Cloud Database
# Found in: Supabase Project Settings -> API
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication (Mandatory)
# Generate a strong 32+ character random string for production
JWT_SECRET=your_super_secret_jwt_key_here_2026

# Google OAuth 2.0
# Found in: Google Cloud Console -> APIs & Services -> Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Cloudinary CDN (Optional - for external image hosting)
# Found in: Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 5. User Roles & Access Hierarchy

The platform uses a role-based access matrix:

1. **Super Admin / Owner**: Complete system privileges, user creation, password reset, financial reports, CMS, and project deletions.
2. **Admin / Project Manager**: Site tracking, expense approvals, leave approvals, and lead management.
3. **Employee / Site Engineer**: Field check-in, GPS photo logging, personal attendance logs, leave submissions, and expense claims.

### Managing Staff & Passwords:
- **Client Super Admin Google Account**: `team.osinteriors@gmail.com` is configured as the exclusive Google account with automatic `Super Admin` privileges for the `/admin` portal.
- **Google SSO for Staff**: Pre-register any employee's Gmail under the Employee Directory. When they click "Continue with Google", they are routed to the mobile-friendly Site Employee Portal (`/employee`). Non-authorized Google accounts are strictly denied admin portal access.
- **Adding New Staff**: Navigate to **Admin Dashboard → Employees → "+ Add Employee"**.
- **Resetting Passwords**: Click **Reset Password** next to any employee in the directory (resets to default: `osinterior123`).

---

## 6. Deployment & Hosting (Vercel)

The repository is configured for zero-configuration continuous deployment with **Vercel**:

1. **Connect Repository**: Link the GitHub repository `new-interior-website` to your Vercel project.
2. **Framework Preset**: Select **Vite** (Build command: `npm run build`, Output directory: `frontend/dist`).
3. **Add Environment Variables**: Populate all environment variables listed in Section 4 above in **Vercel Project Settings → Environment Variables**.
4. **Deploy**: Every push to the `main` branch automatically builds and deploys both the frontend static bundle and serverless API handlers (`/api/*`).

---

## 7. Security Architecture

- **Stateless Tokens**: Auth tokens expire after 8 hours; stale sessions automatically redirect to `/login` via an interceptor.
- **Smart Rate Limiting**:
  - Public lead contact form: Protected by 10 submissions per hour limit + hidden honeypot.
  - Login endpoint: Protected by 20 attempts per 15 minutes limit against brute-force attacks.
  - ERP APIs: Rate limiter excludes authenticated active staff to avoid throttling during real-time dashboard polling.
- **Live Database Role Validation**: The backend checks live Supabase permissions on sensitive actions to prevent stale token privilege escalations.

---

## 8. Support & Routine Maintenance

- **Database Backups**: Automated backups are handled directly via the Supabase dashboard (**Database → Backups**).
- **Domain & SSL**: Handled automatically by Vercel with automated Let's Encrypt SSL certificates.
- **Questions / Issues**: For assistance or platform expansion, contact the engineering team.
