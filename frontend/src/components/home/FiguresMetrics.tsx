'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { METRICS } from '@/data/interiorData';

export default function FiguresMetrics() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF9] text-[#0F0F12] py-20 md:py-32 px-5 sm:px-8 border-b border-stone-200/80">
      <div className="container-px">
        {/* Section Heading with Signature Formula */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-3"
            >
              ✦ BY THE NUMBERS ✦
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-[#0F0F12] block leading-[1.05]">
                OS INTERIORS
              </span>
              <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#8F6E38]">
                in figures.
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
              className="group rounded-[20px] bg-white p-8 border border-stone-200/90 hover:border-[#8F6E38]/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-display font-light text-[46px] sm:text-[56px] lg:text-[62px] leading-none text-[#0F0F12] block mb-3 group-hover:text-[#8F6E38] transition-colors">
                  {stat.value}
                </span>
                <h3 className="font-display font-medium text-base text-[#8F6E38] uppercase tracking-wide">
                  {stat.label}
                </h3>
              </div>
              <p className="mt-6 text-xs sm:text-sm text-stone-500 font-light leading-relaxed border-t border-stone-100 pt-4">
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
