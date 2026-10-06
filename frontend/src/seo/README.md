# OS Interior — Dedicated SEO Architecture Guide

This directory (`src/seo/`) is the **single source of truth** for all Technical SEO, Schema.org Structured Data, Local SEO, Metadata, Services Catalogs, Location Hubs, Advisory Articles, and Commercial Keyword Strategy for the OS Interior website.

---

## 📁 Directory Structure & File Map

```
src/seo/
├── config.ts       # Master Business NAP, Verified Geo Coordinates, Hours & Markets
├── keywords.ts     # Commercial Keyword Architecture & Intent Strategy Registry
├── services.ts     # 8 Commercial & Corporate Service Catalogs, Scope & Deliverables
├── locations.ts    # 4 Metropolitan Hubs (Mumbai, Kandivali HQ, Navi Mumbai, Andheri)
├── blog.ts         # 4 Executive B2B Advisory Articles & Technical Data
├── schemas.ts      # Valid JSON-LD Structured Data Generators (Schema.org)
├── index.ts        # Barrel entrypoint (clean imports: `from '@/seo'`)
└── README.md       # This comprehensive guide
```

---

## 🎯 How to Use & Import

Everything is cleanly exported through `src/seo/index.ts`. In any page, layout, or component across the application, you can simply write:

```typescript
import { 
  BUSINESS_INFO, 
  SERVICES_CATALOG, 
  LOCATIONS_CATALOG, 
  BLOG_POSTS, 
  getOrganizationSchema, 
  getServiceSchema, 
  getLocationSchema, 
  getArticleSchema 
} from '@/seo';
```

*(Note: `src/data/businessConfig.ts` and `src/lib/seo.ts` exist as backward-compatibility bridges that re-export from `@/seo`, ensuring nothing ever breaks).*

---

## 🛠️ Step-by-Step Maintenance Workflows

### 1. How to Update Business Phone, Email, or Hours
Open `src/seo/config.ts`:
- **Phone / Email**: Update `BUSINESS_INFO.phone`, `BUSINESS_INFO.email`.
- **Address / Pin**: Update `BUSINESS_INFO.address.streetAddress` and `postalCode`.
- **Opening Hours**: Update `BUSINESS_INFO.openingHoursSpecification`.
*Any change here automatically updates `src/app/layout.tsx` (Organization & LocalBusiness schema), all contact cards, footer components, and JSON-LD graphs.*

### 2. How to Add or Edit a Commercial Service
Open `src/seo/services.ts`:
- Append a new entry to `SERVICES_CATALOG` following the `ServiceDetail` interface:
```typescript
{
  slug: 'data-center-interiors',
  title: 'Mission-Critical Data Center Interiors',
  shortTitle: 'Data Centers',
  primaryKeyword: 'data center interior contractors Mumbai',
  secondaryKeywords: ['server room fit out', 'mission critical fit out Mumbai'],
  metaTitle: 'Mission-Critical Data Center Interiors Mumbai | OS Interior',
  metaDescription: 'Specialized Category B fit-outs for server rooms and data hubs in Mumbai.',
  h1: 'MISSION-CRITICAL DATA CENTER INTERIORS & COMMAND ROOMS IN MUMBAI',
  intro: '...',
  problemsSolved: ['Thermal containment failure', 'Static electricity risks'],
  scopeOfWork: [
    {
      title: 'Raised Flooring & Precision Airflow',
      description: '...',
      items: ['Antistatic calcium sulphate tiles', 'Cold aisle containment'],
    },
  ],
  processSteps: [...],
  faqs: [...],
  relatedProjectSlugs: ['bkc-corporate-headquarters'],
}
```
*Next.js `generateStaticParams()` will automatically generate `/services/data-center-interiors` during `npm run build`, and `sitemap.ts` will automatically register the new canonical URL!*

### 3. How to Add a New Regional Location Hub
Open `src/seo/locations.ts`:
- Add a new entry to `LOCATIONS_CATALOG` following the `LocationDetail` interface.
- Set `slug`, `name`, `primaryKeyword`, `keyBusinessZones`, and `verifiedLocalProjects`.
*Next.js will automatically generate `/locations/[slug]` and add it to `sitemap.xml`.*

### 4. How to Publish a New B2B Advisory Article
Open `src/seo/blog.ts`:
- Add a new entry to `BLOG_POSTS` following the `BlogPost` interface.
- Specify `slug`, `title`, `tableOfContents`, `sections`, and optional comparison `table` or `callout`.
- Link to related services (`relatedServiceSlug`), locations (`relatedLocationSlug`), and projects (`relatedProjectSlug`).
*Next.js will automatically generate `/blog/[slug]`, generate Article & BreadcrumbList JSON-LD schemas, and update `sitemap.xml`.*

### 5. Managing JSON-LD Structured Data
Open `src/seo/schemas.ts`:
- Contains pure helper functions that produce Schema.org compliant JSON objects:
  - `getOrganizationSchema()`
  - `getLocalBusinessSchema()`
  - `getServiceSchema(service)`
  - `getLocationSchema(location)`
  - `getArticleSchema(post)`
  - `getProjectSchema(project)`
  - `getBreadcrumbSchema(items)`
  - `getFAQSchema(faqs)`
- Google Rich Results can crawl these scripts safely without hydration mismatch.

---

## ⚡ Technical SEO Checklist Verified
- [x] **Canonical URLs**: Generated dynamically for every route via `SITE_URL`.
- [x] **OpenGraph & Twitter Cards**: High-res previews for all services, projects, and articles.
- [x] **Dynamic Sitemap**: Automatically registers all static routes, services, locations, projects, and blogs in `/sitemap.xml`.
- [x] **Robots.txt**: Crawl instructions configured with proper sitemap reference.
- [x] **Local Pack SEO**: Primary Kandivali HQ NAP consistency preserved across all structured entities.
