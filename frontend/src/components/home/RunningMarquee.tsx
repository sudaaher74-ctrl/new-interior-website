'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MARQUEE_PROJECTS } from '@/data/interiorData';

export default function RunningMarquee() {
  // Duplicate array for endless seamless looping
  const doubleProjects = [...MARQUEE_PROJECTS, ...MARQUEE_PROJECTS];

  return (
    <section id="projects" className="relative overflow-hidden bg-[#0A0A0B] text-white py-20 md:py-32 border-b border-white/10">
      {/* Section Header */}
      <div className="container-px mb-12">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-3"
        >
          ✦ SELECTED REALIZATIONS ✦
        </motion.span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-white block leading-[1.05]">
              CURATED ARCHITECTURE
            </span>
            <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#C5A880]">
              on the ground.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm text-[#A1A1AA] max-w-sm font-light leading-relaxed"
          >
            A continuous showcase of corporate campuses, luxury dining venues, and custom joinery delivered across key metropolitan hubs.
          </motion.p>
        </div>
      </div>

      {/* Marquee Track with Side Fade Gradients */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left Gradient Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-32 bg-gradient-to-r from-[#0A0A0B] to-transparent" />

        {/* Right Gradient Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-32 bg-gradient-to-l from-[#0A0A0B] to-transparent" />

        {/* Ticker Row */}
        <div className="flex w-max animate-marquee-glide hover:[animation-play-state:paused]">
          {doubleProjects.map((p, idx) => (
            <Link
              key={`${p.name}-${idx}`}
              href="#contact"
              className="group mx-3 flex-shrink-0 w-[280px] sm:w-[320px] rounded-[20px] bg-[#121216] p-3.5 border border-white/10 hover:border-[#C5A880]/60 transition-all duration-300 block shadow-xl"
            >
              {/* 16:10 Architectural Photo */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-black/40">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:opacity-0 transition-opacity duration-500" />
              </div>

              {/* Card Meta & Title */}
              <div className="mt-3.5 flex items-start justify-between gap-2 px-1">
                <div>
                  <h3 className="font-display font-medium text-sm sm:text-base text-white uppercase tracking-wide group-hover:text-[#C5A880] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5 font-light">{p.location}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-light shrink-0">
                  {p.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
