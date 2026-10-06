'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { METRICS, CLIENT_ADVANTAGES, CLIENT_REVIEWS, SERVICES_TOTEM } from '@/data/interiorData';
import { ChevronRight, ArrowUpRight, CheckCircle2, ShieldCheck, Hammer, Compass, Award, Building2 } from 'lucide-react';

import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Background radial glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="container-px relative z-10 mb-16 sm:mb-24">
        {/* Structured Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'About OS Interior', path: '/about' },
          ]}
        />

        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.05]"
          >
            COMMERCIAL &amp; CORPORATE <br />
            <span className="font-serif italic font-normal text-[#8F6E38]">
              TURNKEY INTERIOR CONTRACTING
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-3xl"
          >
            Headquartered in Kandivali, Mumbai, OS Interior was founded with a singular conviction: fine architecture should never be compromised by multi-vendor fragmentation. We unite spatial planning, MEP engineering, and in-house factory millwork under unified master contractor accountability.
          </motion.p>
        </div>

        {/* Hero Visual Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 relative aspect-[21/9] w-full rounded-[24px] overflow-hidden border border-stone-200/90 shadow-xl bg-stone-100"
        >
          <Image
            src="/images/BelapurC2.webp"
            alt="OS Interiors Executive Office Architecture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8CD9B] font-semibold block mb-1">
              Design Philosophy
            </span>
            <p className="font-display text-lg sm:text-2xl uppercase tracking-tight text-white font-light">
              &ldquo;Space is not an empty volume to be decorated; it is a tactile instrument calibrated for human achievement.&rdquo;
            </p>
          </div>
        </motion.div>
      </section>

      {/* Key Numbers Grid */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl bg-white border border-stone-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#8F6E38] tracking-tight">
                {metric.value}
              </div>
              <div className="mt-4">
                <div className="text-xs uppercase tracking-[0.18em] text-[#0F0F12] font-semibold">
                  {metric.label}
                </div>
                <div className="text-xs text-stone-500 font-light mt-1 leading-relaxed">
                  {metric.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Atelier Story & Manifesto */}
      <section className="container-px relative z-10 mb-20 sm:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38]">
              <span>✦</span>
              <span>THE STUDIO ETHOS</span>
            </div>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0F0F12] uppercase tracking-tight leading-tight">
              ARCHITECTURAL RIGOR &amp; TACTILE PERMANENCE
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              Standard corporate and commercial spaces in India suffer from sterile, interchangeable finishes—white drywall, harsh fluorescent overheads, and paper-thin laminated cabinetry that begins degrading within months.
            </p>
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              At OS Interiors, we reject this ephemeral mediocrity. We sculpt environments grounded in permanence: heavy fluted travertine, European oak, brushed antique bronze, and micro-tolerance architectural joinery. Every finish is selected for its ability to age gracefully under heavy commercial usage.
            </p>
            <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#8F6E38] mb-1">
                  In-House Millwork
                </h4>
                <p className="text-xs text-stone-600 font-light">
                  12,000 sq ft manufacturing atelier handling precision joinery, stone carving &amp; metal craft.
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#8F6E38] mb-1">
                  Penalty Guarantees
                </h4>
                <p className="text-xs text-stone-600 font-light">
                  Liquidated damages clauses backing our completion schedules to protect commercial lease burn.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-[24px] overflow-hidden border border-stone-200 bg-stone-100 shadow-lg">
            <Image
              src="/images/bombayB1.webp"
              alt="OS Interiors Hospitality & Dining Architecture"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-md">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-1">
                Featured Realization
              </span>
              <p className="text-xs sm:text-sm text-[#0F0F12] font-semibold">
                Bombay Barbeque Flagship &bull; 6,500 Sq Ft Turnkey Handover in 30 Days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Execution Phases */}
      <section className="container-px relative z-10 mb-20 sm:mb-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-2">
            The Turnkey Method
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0F0F12] uppercase tracking-tight">
            FOUR PILLARS OF SPATIAL MASTERY
          </h2>
          <p className="mt-3 text-sm text-stone-600 font-light">
            How we eliminate 100% of vendor friction and guarantee seamless architectural handovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SERVICES_TOTEM.map((service) => (
            <div
              key={service.num}
              className="rounded-[20px] bg-white border border-stone-200/90 p-8 sm:p-10 flex flex-col justify-between hover:border-[#8F6E38]/40 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F6E38]">
                    {service.phase}
                  </span>
                  <span className="text-xl font-display font-light text-stone-300">{service.num}</span>
                </div>
                <h3 className="font-display font-medium text-xl uppercase tracking-tight text-[#0F0F12] mb-2">
                  {service.title}
                </h3>
                <h4 className="text-xs text-[#8F6E38] font-light mb-4">
                  {service.subtitle}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0F0F12] mb-2">
                  Key Scope:
                </div>
                <ul className="space-y-1.5 text-xs text-stone-600 font-light">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#8F6E38] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Advantages */}
      <section className="container-px relative z-10 mb-20 sm:mb-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-2">
            Contractor Benchmark
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0F0F12] uppercase tracking-tight">
            WHY CLIENTS CHOOSE OS INTERIORS
          </h2>
          <p className="mt-3 text-sm text-stone-600 font-light">
            Engineered advantages designed to safeguard your capital and execution schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLIENT_ADVANTAGES.map((adv) => (
            <div
              key={adv.id}
              className="rounded-2xl bg-white border border-stone-200/90 p-6 sm:p-8 flex flex-col justify-between hover:border-[#8F6E38]/50 shadow-sm transition-all duration-300"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8F6E38] block mb-1">
                  {adv.highlight}
                </span>
                <h3 className="font-display font-medium text-lg uppercase tracking-tight text-[#0F0F12] mb-3">
                  {adv.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  {adv.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Reviews */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="rounded-[24px] bg-white border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] mb-6">
            <span>✦</span>
            <span>EXECUTIVE ENDORSEMENTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CLIENT_REVIEWS.map((rev) => (
              <div key={rev.brand} className="flex flex-col justify-between">
                <p className="font-serif italic text-base text-stone-700 leading-relaxed mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-stone-100">
                  <div className="text-sm font-display font-semibold uppercase text-[#0F0F12]">
                    {rev.author}
                  </div>
                  <div className="text-xs text-stone-500 font-light">
                    {rev.role} &bull; <span className="text-[#8F6E38] font-medium">{rev.brand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-px relative z-10">
        <div className="rounded-[24px] bg-[#F5F3EE] border border-stone-200 p-8 sm:p-12 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-2 block">
              Start The Dialogue
            </span>
            <h3 className="font-display font-light text-2xl sm:text-3xl text-[#0F0F12] uppercase tracking-tight">
              DISCUSS YOUR UPCOMING PROJECT WITH OUR PRINCIPALS
            </h3>
            <p className="mt-2 text-sm text-stone-600 font-light">
              Direct access to our studio directors and technical leads in Mumbai and Navi Mumbai.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md"
            >
              <span>Initiate Project Consultation</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-8 py-4 text-xs uppercase tracking-[0.16em] font-medium text-[#0F0F12] hover:border-[#8F6E38] hover:text-[#8F6E38] bg-white transition-all"
            >
              <span>Explore Realizations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
