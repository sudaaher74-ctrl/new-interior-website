import { useEffect } from 'react';

const SUFFIX = 'OS Interiors';

/**
 * Sets the tab title and meta description for a route.
 *
 * The site is a single HTML document, so without this every page would share
 * the one <title> baked into index.html — including in search results.
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX;

    if (!description) return;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', description);
  }, [title, description]);
}
