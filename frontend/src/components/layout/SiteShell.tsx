'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScroll from '@/components/providers/SmoothScroll';
import StickyContact from '@/components/ui/StickyContact';

interface SiteShellProps {
  children: React.ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <SmoothScroll>
      <Navbar />

      <main className="min-h-screen bg-[#0A0A0B]">{children}</main>
      <Footer />
      <StickyContact />
    </SmoothScroll>
  );
}
