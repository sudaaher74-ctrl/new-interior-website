import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Our Atelier & Architectural Philosophy | OS Interiors',
  description:
    'Learn about the OS Interiors ethos—uniting spatial masterplanning, licensed civil engineering, and in-house millwork into single-point turnkey accountability.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
