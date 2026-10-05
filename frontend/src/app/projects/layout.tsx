import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architectural Portfolio & Realized Projects | OS Interiors',
  description:
    'Explore realized commercial headquarters, luxury dining establishments, flagship retail, and bespoke millwork executed turnkey by OS Interiors.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
