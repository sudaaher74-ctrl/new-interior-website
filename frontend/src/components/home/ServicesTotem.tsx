'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SERVICES_TOTEM } from '@/data/interiorData';
import { ArrowRight } from 'lucide-react';

export default function ServicesTotem() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#FAFAF9] text-[#0F0F12] py-24 md:py-36 px-5 sm:px-8 border-b border-stone-200/80">
      <div className="container-px">
        {/* Section Heading with Signature Formula */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-3"
          >
            ✦ INTEGRATED DISCIPLINES ✦
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-[#0F0F12] block leading-[1.05]">
              OUR END-TO-END
            </span>
            <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#8F6E38]">
              Accompaniment.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-sm sm:text-base text-stone-600 font-light leading-relaxed"
          >
            A cohesive four-stage architectural journey from preliminary density audits to bespoke atelier joinery, all unified under a single prime contract.
          </motion.p>
        </div>

        {/* Stacking Card Sequence */}
        <div className="relative space-y-8 sm:space-y-12">
          {SERVICES_TOTEM.map((srv, idx) => (
            <div
              key={srv.num}
              style={{ top: `${96 + idx * 16}px` }}
              className="sticky rounded-[28px] bg-white border border-stone-200/90 p-6 sm:p-10 lg:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-[#8F6E38]/60 transition-all duration-400 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column (7 cols): Phase badge, titles, description, deliverables, link */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Phase Pill Badge */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[#8F6E38] text-xs uppercase tracking-widest font-semibold">
                        {srv.phase}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-light">
                        Stage 0{idx + 1} / 04
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="font-display font-light text-2xl sm:text-3xl lg:text-4xl text-[#0F0F12] uppercase tracking-tight leading-snug">
                      {srv.title}
                    </h3>
                    <p className="font-serif italic text-base sm:text-lg text-[#8F6E38] mt-1 mb-4">
                      {srv.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed mb-6">
                      {srv.description}
                    </p>

                    {/* 4-Item Deliverables Checklist with Bronze Bullet Dots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 border-t border-stone-100 pt-6">
                      {srv.deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8F6E38] shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discipline CTA Link */}
                  <div>
                    <Link
                      href={srv.href}
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0F0F12] text-white hover:bg-[#8F6E38] text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-300 shadow-md group/btn"
                    >
                      <span>Explore this discipline</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Right Column (5 cols): 4:3 Architectural Photo with slow zoom */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-stone-100 border border-stone-200">
                    <Image
                      src={srv.image}
                      alt={srv.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
