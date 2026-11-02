// Killer Service Worker: Immediately unregisters legacy PWA and destroys all cached assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Wipe all CacheStorage entries left by Workbox or previous PWA builds
      if ('caches' in self) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 2. Unregister this and any other service worker registrations
      if (self.registration) {
        await self.registration.unregister();
      }

      // 3. Claim clients and navigate active windows to current URL so they get the fresh Next.js app
      await self.clients.claim();
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of windowClients) {
        if (client.url && 'navigate' in client) {
          try {
            await client.navigate(client.url);
          } catch (e) {
            // Client might be navigating or closing already
          }
        }
      }
    })()
  );
});

// Do not intercept or cache any fetch requests; pass straight to network
self.addEventListener('fetch', () => {
  return;
});

