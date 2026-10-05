'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { METRICS } from '@/data/interiorData';

export default function FiguresMetrics() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0B] text-white py-20 md:py-32 px-5 sm:px-8 border-b border-white/10">
      <div className="container-px">
        {/* Section Heading with Signature Formula */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-3"
            >
              ✦ BY THE NUMBERS ✦
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-white block leading-[1.05]">
                OS INTERIORS
              </span>
              <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#C5A880]">
                in figures.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base text-[#A1A1AA] max-w-md font-light leading-relaxed"
          >
            Measurable velocity, uncompromised craftsmanship, and unwavering budgetary adherence have earned our studio the trust of market pioneers.
          </motion.p>
        </div>

        {/* 4-Column Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-[20px] bg-[#121216] p-8 border border-white/10 hover:border-[#C5A880]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-display font-light text-[46px] sm:text-[56px] lg:text-[62px] leading-none text-white block mb-3 group-hover:text-[#E2C799] transition-colors">
                  {stat.value}
                </span>
                <h3 className="font-display font-medium text-base text-[#C5A880] uppercase tracking-wide">
                  {stat.label}
                </h3>
              </div>
              <p className="mt-6 text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed border-t border-white/5 pt-4">
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
