import type { Metadata, Viewport } from 'next';
import { Poppins, Cormorant_Garamond } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SiteShell from '@/components/layout/SiteShell';
import { SITE_URL, BUSINESS_INFO, getOrganizationSchema, getLocalBusinessSchema } from '@/seo';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
});

export const viewport: Viewport = {
  themeColor: '#FAFAF9',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Corporate Interior Designers in Mumbai | OS Interior',
    template: '%s | OS Interior',
  },
  description:
    'Corporate and commercial interior designers in Mumbai. Turnkey office fit-outs, executive headquarters, space planning & commercial renovations across Mumbai, Navi Mumbai & Pan-India.',
  keywords: [
    'corporate interior designers Mumbai',
    'commercial interior designers Mumbai',
    'office interior designers Mumbai',
    'corporate interior company Mumbai',
    'turnkey interior contractors Mumbai',
    'office fit out company Mumbai',
    'office interior contractors Mumbai',
    'corporate office interior Mumbai',
    'workspace interior designers Mumbai',
    'design and build company Mumbai',
    'office interior designers Kandivali',
    'office interior designers Navi Mumbai',
  ],
  authors: [{ name: 'OS Interior Studio' }],
  creator: 'OS Interior',
  publisher: 'OS Interior',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Corporate Interior Designers in Mumbai | OS Interior',
    description:
      'Premier commercial interior design and turnkey contracting studio in Mumbai. Executive headquarters, commercial fit-outs, and bespoke atelier millwork.',
    url: SITE_URL,
    siteName: 'OS Interior',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/bombayB1.webp',
        width: 1200,
        height: 630,
        alt: 'OS Interior — Corporate & Commercial Interior Design Studio Mumbai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Interior Designers in Mumbai | OS Interior',
    description:
      'Turnkey corporate & commercial interior design studio in Mumbai. Specialized in office fit-outs, space planning, and bespoke architectural millwork.',
    images: ['/images/bombayB1.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorant.variable} scroll-smooth`}
    >
      <head>
        {/* Google Analytics via next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XG07N4CDCF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XG07N4CDCF', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="bg-[#FAFAF9] text-[#3F3F46] font-sans antialiased selection:bg-[#8F6E38] selection:text-white">
        {/* Core Organization & Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
