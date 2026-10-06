'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CLIENT_ADVANTAGES } from '@/data/interiorData';

// Custom SVG geometric symbols in champagne gold
function GeometricIcon({ shape }: { shape: string }) {
  const iconClass = 'w-6 h-6 text-[#8F6E38] stroke-current fill-none stroke-[1.5]';

  switch (shape) {
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="2 2" strokeOpacity="0.4" />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path d="M12 2L22 12L12 22L2 12Z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path d="M12 3L22 20H2L12 3Z" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
        </svg>
      );
    case 'polygon':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path d="M12 2L21 8.5V17.5L12 22L3 17.5V8.5L12 2Z" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <polygon points="12 2 20 7 20 17 12 22 4 17 4 7" />
          <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default function ClientAdvantages() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF9] text-[#0F0F12] py-24 md:py-36 px-5 sm:px-8 border-b border-stone-200/80">
      <div className="container-px">
        {/* Section Header with Signature Formula */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-3"
            >
              ✦ ARCHITECTURAL RIGOR ✦
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-[#0F0F12] block leading-[1.05]">
                WHY CLIENTS CHOOSE
              </span>
              <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#8F6E38]">
                OS Interiors.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base text-stone-600 max-w-md font-light leading-relaxed"
          >
            We remove the traditional vulnerabilities of commercial fit-outs: fragmented contracts, schedule slippages, and diluted architectural integrity.
          </motion.p>
        </div>

        {/* 6-Card Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CLIENT_ADVANTAGES.map((adv, idx) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-[20px] bg-white p-8 border border-stone-200/90 hover:border-[#8F6E38]/60 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg"
            >
              <div>
                {/* Top Geometric Symbol in Champagne Gold */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 border border-stone-200 group-hover:border-[#8F6E38]/50 transition-colors">
                    <GeometricIcon shape={adv.shape} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#8F6E38] px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
                    {adv.highlight}
                  </span>
                </div>

                {/* Advantage Title */}
                <h3 className="font-display font-medium text-lg sm:text-xl text-[#0F0F12] uppercase tracking-wide group-hover:text-[#8F6E38] transition-colors">
                  {adv.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  {adv.description}
                </p>
              </div>

              {/* Bottom Hairline Highlight */}
              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] uppercase tracking-wider text-stone-400">
                <span>Verified Standard</span>
                <span className="text-[#8F6E38] font-medium">0{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
