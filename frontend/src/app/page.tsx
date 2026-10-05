import React from 'react';
import HeroShowreel from '@/components/home/HeroShowreel';
import EditorialManifesto from '@/components/home/EditorialManifesto';
import FiguresMetrics from '@/components/home/FiguresMetrics';
import RunningMarquee from '@/components/home/RunningMarquee';
import ServicesTotem from '@/components/home/ServicesTotem';
import ClientAdvantages from '@/components/home/ClientAdvantages';
import VerifiedReviews from '@/components/home/VerifiedReviews';
import EditorialCTA from '@/components/home/EditorialCTA';
import FAQAccordion from '@/components/home/FAQAccordion';

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="w-full bg-[#0A0A0B] selection:bg-[#C5A880] selection:text-[#0A0A0B]">
      {/* 1. Fullscreen Cinematic Hero Showreel */}
      <HeroShowreel />

      {/* 2. Editorial Signature Manifesto */}
      <EditorialManifesto />

      {/* 3. By the Numbers Metrics ("In Figures") */}
      <FiguresMetrics />

      {/* 4. Infinite Running Line Marquee */}
      <RunningMarquee />

      {/* 5. Stacking Services Totem (Sticky Card Sequence) */}
      <ServicesTotem />

      {/* 6. Client Advantages / Disciplines Grid */}
      <ClientAdvantages />

      {/* 7. Verified Client Reviews */}
      <VerifiedReviews />

      {/* 8. High-Impact Editorial CTA Banner */}
      <EditorialCTA />

      {/* 9. FAQ Accordion */}
      <FAQAccordion />
    </div>
  );
}
