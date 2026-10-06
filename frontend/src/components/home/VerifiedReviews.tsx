'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CLIENT_REVIEWS } from '@/data/interiorData';

export default function VerifiedReviews() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-[#FAFAF9] text-[#0F0F12] py-24 md:py-36 px-5 sm:px-8 border-b border-stone-200/80">
      <div className="container-px">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            {/* Top Verified Star Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-3"
            >
              <span>★★★★★</span>
              <span>Verified Partnerships</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-[#0F0F12] block leading-[1.05]">
                THEY TRUST OUR CRAFT
              </span>
              <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#8F6E38]">
                Listen to Them.
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
            Direct testimonials from founders, managing directors, and facility directors who have lived through our turnkey process.
          </motion.p>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CLIENT_REVIEWS.map((rev, idx) => (
            <motion.div
              key={rev.brand}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[24px] bg-white border border-stone-200/90 p-8 sm:p-10 flex flex-col justify-between hover:border-[#8F6E38]/50 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <div>
                {/* Top Highlight Pill & Serif Quotation Mark */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8F6E38] px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200">
                    {rev.highlight}
                  </span>
                  <span className="text-3xl font-serif text-[#8F6E38]/40 select-none">&ldquo;</span>
                </div>

                {/* Quote Body */}
                <blockquote className="text-sm sm:text-base text-stone-700 font-light leading-relaxed mb-8">
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>
              </div>

              {/* Author & Brand Footer */}
              <div className="pt-6 border-t border-stone-100">
                <p className="font-display font-medium text-base text-[#0F0F12] tracking-wide uppercase">
                  {rev.author}
                </p>
                <p className="text-xs text-[#8F6E38] mt-1 font-light">
                  {rev.role} &bull; <span className="text-stone-700 font-normal">{rev.brand}</span>
                </p>
                <p className="text-[11px] text-stone-500 mt-1 uppercase tracking-wider font-light">
                  {rev.city}, India
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
