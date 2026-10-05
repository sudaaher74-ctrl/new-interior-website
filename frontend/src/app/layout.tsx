import type { Metadata, Viewport } from 'next';
import { Poppins, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import SiteShell from '@/components/layout/SiteShell';

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
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'OS Interiors | Obsidian Architectural Brutalism & Luxury Interior Firm',
  description:
    'Award-winning architectural and turnkey interior design studio specializing in corporate headquarters, luxury dining, retail flagships, and bespoke atelier millwork.',
  keywords: [
    'Interior Architecture Studio',
    'Turnkey Commercial Fit-Outs',
    'Luxury Office Interiors Mumbai',
    'Bespoke Joinery & Millwork',
    'Hospitality Interior Contractors',
    'Obsidian Dark Luxury Design',
  ],
  authors: [{ name: 'OS Interiors Studio' }],
  openGraph: {
    title: 'OS Interiors | Architectural Brutalism & Luxury Design',
    description:
      'Deep obsidian canvas, hairline architectural linework, warm champagne gold accents, and turnkey master execution.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'OS Interiors',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'OS Interiors',
  description:
    'Ultra-luxury architectural brutalism, corporate turnkey fit-outs, and bespoke atelier joinery.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  telephone: '+91 89591 73790',
  priceRange: '₹₹₹₹',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="bg-[#0A0A0B] text-[#D4D4D8] font-sans antialiased selection:bg-[#C5A880] selection:text-[#0A0A0B]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
