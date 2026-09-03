# OS Interiors — Commercial & Luxury Residential Interior Design Platform

Official web platform and internal Operations & ERP management suite for **OS Interiors**.

---

## 🌟 Quick Links

- **Live Website**: [osinterior.in](https://osinterior.in)
- **Admin Dashboard**: [osinterior.in/admin](https://osinterior.in/admin)
- **Employee Field Portal**: [osinterior.in/employee](https://osinterior.in/employee)
- **Client Handover Guide**: Please refer to [HANDOVER.md](./HANDOVER.md) for credentials, architecture, and deployment instructions.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
# Install dependencies for both frontend and backend
npm run postinstall
```

### 3. Environment Variables
Copy `.env.example` into `backend/.env` and `frontend/.env`, filling in the Supabase and authentication values:
```bash
cp .env.example backend/.env
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend API Server (Port 5005)
cd backend
npm start

# Terminal 2 - Frontend Client (Vite Dev Server)
cd frontend
npm run dev
```

---

## 📦 Project Structure

```
├── api/                  # Vercel Serverless Function entry point
├── backend/              # Node.js & Express REST API
│   ├── config/           # Supabase & Cloudinary configurations
│   ├── middleware/       # JWT Auth & Role-Based Access Control (RBAC)
│   ├── routes/           # Attendance, Site Visits, Leads, Projects, Expenses, Leaves, CMS
│   └── server.js         # Express main application
├── frontend/             # React (Vite) PWA Client
│   ├── public/           # Static assets, WebP imagery, PWA manifest, service workers
│   └── src/
│       ├── api/          # API callers, session guards, and token interceptors
│       ├── components/   # Reusable UI components & NotificationBell
│       └── pages/        # Public pages & Admin / Employee portals
├── HANDOVER.md           # Client handover documentation & production setup
└── vercel.json           # Production deployment rewrites & routing rules
```

---

## 📄 License & Ownership
Copyright © 2026 OS Interiors. All rights reserved.
