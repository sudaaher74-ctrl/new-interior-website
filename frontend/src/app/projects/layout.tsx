import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Interior Projects & Case Studies Mumbai | OS Interior',
  description:
    'Explore verified corporate office interiors, luxury dining fit-outs, and commercial turnkey projects executed by OS Interior across Mumbai, CBD Belapur, Malad & BKC.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Commercial Interior Projects & Case Studies | OS Interior',
    description:
      'Turnkey commercial and corporate interior portfolio by OS Interior. Realized corporate headquarters, dining venues, and bespoke architectural millwork.',
    url: 'https://osinterior.in/projects',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
