import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact OS Interior | Request Commercial Interior Consultation Mumbai',
  description:
    'Contact OS Interior in Kandivali, Mumbai. Discuss corporate office interiors, commercial turnkey fit-outs, site feasibility audits, and BOQ estimates across Mumbai & Navi Mumbai.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact OS Interior | Commercial Interior Consultation Mumbai',
    description:
      'Schedule a spatial feasibility review or request a turnkey interior estimate with OS Interior studio directors.',
    url: 'https://osinterior.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
