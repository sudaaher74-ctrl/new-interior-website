import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Building2, ShieldCheck, Layers, Sparkles, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SERVICES_CATALOG } from '@/data/businessConfig';
import { ALL_PROJECTS } from '@/data/interiorData';

export const metadata: Metadata = {
  title: 'Commercial & Corporate Interior Services Mumbai | OS Interior',
  description:
    'Comprehensive corporate and commercial interior design & turnkey contracting services in Mumbai. Office fit-outs, space planning, MEP, civil execution & factory millwork.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Commercial & Corporate Interior Services Mumbai | OS Interior',
    description:
      'Single-point turnkey interior design and contracting for corporate offices, retail flagships, and commercial spaces in Mumbai and Navi Mumbai.',
    url: 'https://osinterior.in/services',
  },
};

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-36 pb-24">
      {/* Radial Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#C5A880]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <div className="container-px relative z-10 mb-16 sm:mb-20">
        <Breadcrumbs
          items={[
            { name: 'Services', path: '/services' },
          ]}
        />

        <div className="max-w-4xl">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-3">
            ✦ SINGLE-SOURCE PRIME CONTRACTOR ✦
          </span>
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.05]">
            COMMERCIAL &amp; CORPORATE <br />
            <span className="font-serif italic font-normal text-[#C5A880]">
              INTERIOR SERVICES IN MUMBAI
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-[#A1A1AA] font-light max-w-2xl leading-relaxed">
            From preliminary floorplate circulation modeling to heavy civil engineering, licensed MEP coordination, and factory-direct millwork fabrication, OS Interior provides single-contract execution across Mumbai, Navi Mumbai, and pan-India.
          </p>
        </div>
      </div>

      {/* Services Grid (6 Core Disciplines) */}
      <div className="container-px relative z-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_CATALOG.map((service, idx) => (
            <article
              key={service.slug}
              className="rounded-[24px] bg-[#121216] border border-white/10 p-8 flex flex-col justify-between hover:border-[#C5A880]/50 transition-all duration-300 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
                    Specialization 0{idx + 1}
                  </span>
                  <Building2 className="h-5 w-5 text-white/30 group-hover:text-[#C5A880] transition-colors" />
                </div>

                <h2 className="font-display text-2xl uppercase tracking-tight text-white mb-3 group-hover:text-[#C5A880] transition-colors">
                  <Link href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed mb-6">
                  {service.excerpt}
                </p>

                <div className="pt-4 border-t border-white/5 space-y-2 mb-6">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium block">
                    Core Scope Highlights:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#D4D4D8] font-light">
                    {service.scopeOfWork.slice(0, 3).map((scope, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                        <span>{scope.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#C5A880] group-hover:text-white transition-colors"
                >
                  <span>Explore Technical Scope</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Why Single-Point Contracting Banner */}
      <section className="container-px relative z-10 mb-20">
        <div className="rounded-[24px] bg-gradient-to-r from-[#181820] to-[#0E0E12] border border-white/15 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880] mb-2 block">
                The OS Interior Advantage
              </span>
              <h3 className="font-display font-light text-2xl sm:text-3xl text-white uppercase tracking-tight">
                ELIMINATE 100% OF MULTI-VENDOR DELAYS &amp; BUDGET DISPUTES
              </h3>
              <p className="mt-3 text-sm text-[#A1A1AA] font-light leading-relaxed max-w-2xl">
                Traditional commercial fit-outs suffer when independent designers, civil contractors, HVAC teams, and carpenters blame one another for mistakes. OS Interior acts as your single prime contractor—designing, engineering, manufacturing, and handing over under penalty-backed timelines.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A880] text-[#0A0A0B] px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white transition-all shadow-xl"
              >
                <span>Request Turnkey Proposal</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.16em] font-light text-white hover:bg-white/5 transition-all text-center"
              >
                <span>Browse Realized Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
