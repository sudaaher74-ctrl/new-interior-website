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
          '**/EmployeeDashboard-*',
          '**/PremiumPage-*',
          '**/html2canvas-*',
          '**/index.es-*',
          '**/purify.es-*',
          // Legacy scripts from the pre-React static site; no longer loaded.
          'script.js',
          'admin.js',
        ],
      },
      manifest: {
        name: 'OS Interiors',
        short_name: 'OS Interiors',
        description: 'Commercial interior and turnkey fit-out contractor, Mumbai.',
        theme_color: '#f5ead8',
        background_color: '#f5ead8',
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
        ],
      },
    })
  ],
})
