import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  trailingSlash: false,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  eslint: {
    // Legacy pages/ are Vite files; App Router is in src/app/
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/project',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/portfolio/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
      {
        source: '/process',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/services/turnkey',
        destination: '/services/turnkey-interiors',
        permanent: true,
      },
      {
        source: '/services/corporate',
        destination: '/services/corporate-interiors',
        permanent: true,
      },
      {
        source: '/services/commercial',
        destination: '/services/commercial-interiors',
        permanent: true,
      },
      {
        source: '/services/office',
        destination: '/services/office-interiors',
        permanent: true,
      },
      {
        source: '/locations/kandivali-west',
        destination: '/locations/kandivali',
        permanent: true,
      },
      {
        source: '/locations/belapur',
        destination: '/locations/navi-mumbai',
        permanent: true,
      },
      {
        source: '/locations/vashi',
        destination: '/locations/navi-mumbai',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Clear-Site-Data',
            value: '"cache", "storage"',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/registerSW.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/workbox-efbd304a.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
