import { MetadataRoute } from 'next';
import { SITE_URL, SERVICES_CATALOG, LOCATIONS_CATALOG, BLOG_POSTS } from '@/seo';
import { ALL_PROJECTS } from '@/data/interiorData';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Service Detail Routes
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES_CATALOG.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // Location Hub Routes
  const locationRoutes: MetadataRoute.Sitemap = LOCATIONS_CATALOG.map((location) => ({
    url: `${SITE_URL}/locations/${location.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // Project Case Study Routes
  const projectRoutes: MetadataRoute.Sitemap = ALL_PROJECTS.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // B2B Commercial Advisory Guides
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedDate),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...projectRoutes, ...blogRoutes];
}
