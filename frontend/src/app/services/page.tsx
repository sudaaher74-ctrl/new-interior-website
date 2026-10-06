import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Building2, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SERVICES_CATALOG } from '@/seo';

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
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Soft Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <div className="container-px relative z-10 mb-16 sm:mb-20">
        <Breadcrumbs
          items={[
            { name: 'Services', path: '/services' },
          ]}
        />

        <div className="max-w-4xl">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-3">
            ✦ SINGLE-SOURCE PRIME CONTRACTOR ✦
          </span>
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.05]">
            COMMERCIAL &amp; CORPORATE <br />
            <span className="font-serif italic font-normal text-[#8F6E38]">
              INTERIOR SERVICES IN MUMBAI
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-stone-600 font-light max-w-2xl leading-relaxed">
            From preliminary floorplate circulation modeling to heavy civil engineering, licensed MEP coordination, and factory-direct millwork fabrication, OS Interior provides single-contract execution across Mumbai, Navi Mumbai, and pan-India.
          </p>
        </div>
      </div>

      {/* Services Grid (8 Core Disciplines) */}
      <div className="container-px relative z-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_CATALOG.map((service, idx) => (
            <article
              key={service.slug}
              className="rounded-[24px] bg-white border border-stone-200/90 p-8 flex flex-col justify-between hover:border-[#8F6E38]/50 hover:shadow-lg transition-all duration-300 shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#8F6E38]">
                    Specialization 0{idx + 1}
                  </span>
                  <Building2 className="h-5 w-5 text-stone-400 group-hover:text-[#8F6E38] transition-colors" />
                </div>

                <h2 className="font-display text-2xl uppercase tracking-tight text-[#0F0F12] mb-3 group-hover:text-[#8F6E38] transition-colors">
                  <Link href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
                  {service.excerpt}
                </p>

                <div className="pt-4 border-t border-stone-100 space-y-2 mb-6">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium block">
                    Core Scope Highlights:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700 font-light">
                    {service.scopeOfWork.slice(0, 3).map((scope, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#8F6E38] shrink-0 mt-0.5" />
                        <span>{scope.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#8F6E38] group-hover:text-[#0F0F12] transition-colors"
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
        <div className="rounded-[24px] bg-[#F5F3EE] border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-2 block">
                The OS Interior Advantage
              </span>
              <h3 className="font-display font-light text-2xl sm:text-3xl text-[#0F0F12] uppercase tracking-tight">
                ELIMINATE 100% OF MULTI-VENDOR DELAYS &amp; BUDGET DISPUTES
              </h3>
              <p className="mt-3 text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                Traditional commercial fit-outs suffer when independent designers, civil contractors, HVAC teams, and carpenters blame one another for mistakes. OS Interior acts as your single prime contractor—designing, engineering, manufacturing, and handing over under penalty-backed timelines.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md text-center"
              >
                <span>Request Turnkey Proposal</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-8 py-4 text-xs uppercase tracking-[0.16em] font-medium text-[#0F0F12] hover:border-[#8F6E38] hover:text-[#8F6E38] transition-all text-center"
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
