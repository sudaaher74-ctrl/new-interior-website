import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About OS Interior | Commercial & Turnkey Interior Contractors Mumbai',
  description:
    'Learn about OS Interior — premier commercial and corporate interior contracting studio headquartered in Kandivali, Mumbai. Uniting spatial design, civil MEP engineering & in-house millwork.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About OS Interior | Turnkey Interior Contractors Mumbai',
    description:
      'Single-point master contractor accountability for corporate headquarters and commercial establishments across Mumbai, Navi Mumbai, and pan-India.',
    url: 'https://osinterior.in/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
