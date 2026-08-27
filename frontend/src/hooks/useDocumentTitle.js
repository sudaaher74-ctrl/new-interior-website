import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SUFFIX = 'OS Interiors';
const SITE_URL = 'https://www.osinteriors.in';

/**
 * Sets the tab title, meta description, canonical URL, and Open Graph tags for a route.
 */
export function useDocumentTitle(title, description, image = '/images/og-image.webp') {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} — ${SUFFIX}` : SUFFIX;
    const fullUrl = `${SITE_URL}${location.pathname}`;
    
    document.title = fullTitle;

    // Helper to safely update or create meta tags
    const updateMetaTag = (selector, attribute, value) => {
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute('content', value);
      } else {
        tag = document.createElement('meta');
        if (selector.includes('name=')) tag.setAttribute('name', selector.match(/name="(.*?)"/)[1]);
        if (selector.includes('property=')) tag.setAttribute('property', selector.match(/property="(.*?)"/)[1]);
        tag.setAttribute('content', value);
        document.head.appendChild(tag);
      }
    };

    if (description) {
      updateMetaTag('meta[name="description"]', 'content', description);
      updateMetaTag('meta[property="og:description"]', 'content', description);
      updateMetaTag('meta[name="twitter:description"]', 'content', description);
    }

    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    
    updateMetaTag('meta[property="og:image"]', 'content', `${SITE_URL}${image}`);
    updateMetaTag('meta[name="twitter:image"]', 'content', `${SITE_URL}${image}`);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', fullUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', fullUrl);
      document.head.appendChild(canonical);
    }
  }, [title, description, image, location.pathname]);
}
