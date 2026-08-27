import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // The dashboards are lazy-loaded on purpose (see App.jsx). Precaching
        // them would pull the whole ERP and the PDF stack down in the
        // background on a marketing visit, undoing the code splitting.
        globIgnores: [
          '**/AdminDashboard-*',
          '**/PremiumPage-*',
          '**/html2canvas-*',
          '**/index.es-*',
          '**/purify.es-*',
          // Legacy scripts from the pre-React static site; no longer loaded.
          'script.js',
          'admin.js',
        ],
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*(projects|site-visits).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'OS Interiors',
        short_name: 'OS Interiors',
        description: 'Commercial interior and turnkey fit-out contractor, Mumbai.',
        theme_color: '#f8fafc',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          }
        ],
      },
    })
  ],
})
