import React from 'react';
import type { Metadata } from 'next';
import HeroShowreel from '@/components/home/HeroShowreel';
import EditorialManifesto from '@/components/home/EditorialManifesto';
import FiguresMetrics from '@/components/home/FiguresMetrics';
import RunningMarquee from '@/components/home/RunningMarquee';
import ServicesTotem from '@/components/home/ServicesTotem';
import ClientAdvantages from '@/components/home/ClientAdvantages';
import VerifiedReviews from '@/components/home/VerifiedReviews';
import EditorialCTA from '@/components/home/EditorialCTA';
import FAQAccordion from '@/components/home/FAQAccordion';
import { FAQS } from '@/data/interiorData';
import { getFAQSchema } from '@/lib/seo';
import Link from 'next/link';
import { ArrowUpRight, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { SERVICES_CATALOG, LOCATIONS_CATALOG } from '@/data/businessConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Corporate Interior Designers in Mumbai | OS Interior',
  description:
    'Award-winning corporate and commercial interior designers in Mumbai. Turnkey office fit-outs, space planning, MEP & executive boardrooms across Mumbai, BKC & Navi Mumbai.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  const faqSchema = getFAQSchema(FAQS);

  return (
    <div className="w-full bg-[#0A0A0B] selection:bg-[#C5A880] selection:text-[#0A0A0B]">
      {/* FAQ Schema for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Fullscreen Cinematic Hero Showreel */}
      <HeroShowreel />

      {/* Commercial Services Fast-Track Nav for B2B Crawlers & Users */}
      <section className="bg-[#0E0E12] border-y border-white/10 py-10 px-5 sm:px-8">
        <div className="container-px">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                Commercial Interior Specializations
              </span>
              <h2 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white mt-1">
                Core Turnkey Interior Contracting Capabilities
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-white uppercase tracking-wider font-medium"
            >
              <span>View All 6 Services</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SERVICES_CATALOG.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C5A880] hover:bg-white/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <Building2 className="h-4 w-4 text-[#C5A880] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white block uppercase tracking-wide group-hover:text-[#C5A880] transition-colors leading-snug">
                    {service.shortTitle}
                  </span>
                </div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mt-3 block group-hover:text-white transition-colors">
                  Explore Scope &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Editorial Signature Manifesto */}
      <EditorialManifesto />

      {/* 3. By the Numbers Metrics ("In Figures") */}
      <FiguresMetrics />

      {/* 4. Infinite Running Line Marquee */}
      <RunningMarquee />

      {/* 5. Stacking Services Totem (Sticky Card Sequence) */}
      <ServicesTotem />

      {/* Regional Execution Coverage: Mumbai Metros & Key Corridors */}
      <section className="bg-[#0A0A0B] py-20 px-5 sm:px-8 border-b border-white/10">
        <div className="container-px">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-2">
                ✦ REGIONAL EXECUTION CORRIDORS ✦
              </span>
              <h2 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white">
                MUMBAI, NAVI MUMBAI &amp; <span className="font-serif italic text-[#C5A880]">BEYOND</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] font-light max-w-md leading-relaxed">
              Headquartered in Kandivali West, OS Interior deploys dedicated on-site engineering crews and factory-direct millwork to prime corporate clusters across the Mumbai Metropolitan Region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOCATIONS_CATALOG.map((loc) => (
              <div
                key={loc.slug}
                className="rounded-2xl bg-[#121216] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#C5A880]/50 transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-[#C5A880]" />
                    <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                      {loc.name}
                    </span>
                  </div>
                  <h3 className="font-display text-lg uppercase tracking-tight text-white mb-2 group-hover:text-[#C5A880] transition-colors">
                    {loc.h1}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed mb-4">
                    {loc.coverageSummary}
                  </p>
                  <ul className="space-y-1.5 text-xs text-white/80 font-light border-t border-white/5 pt-3">
                    {loc.keyBusinessZones.slice(0, 2).map((zone, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-[#C5A880] shrink-0 mt-0.5" />
                        <span className="text-[11px] text-[#A1A1AA]">{zone}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] uppercase tracking-wider font-semibold hover:text-white transition-colors"
                  >
                    <span>View {loc.name} Hub &amp; Projects</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
