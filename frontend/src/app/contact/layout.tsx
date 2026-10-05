import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Initiate an Architectural Commission | Contact OS Interiors Studio',
  description:
    'Direct studio coordinates and spatial consultation booking for Mumbai, Navi Mumbai, and metro turnkey interior commissions.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
