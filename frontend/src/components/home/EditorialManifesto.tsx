'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function EditorialManifesto() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0A0A0B] text-white py-24 md:py-36 px-5 sm:px-8 border-b border-white/10">
      <span id="philosophy" className="sr-only" />
      {/* Subtle ambient radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5A880]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] mb-8"
        >
          <span>✦</span>
          <span>OUR SIGNATURE</span>
          <span>✦</span>
        </motion.div>

        {/* Giant Cormorant Garamond Italic Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-[28px] sm:text-[40px] md:text-[52px] lg:text-[58px] leading-[1.25] font-normal text-white"
        >
          <span className="text-[#C5A880] font-serif not-italic mr-2 text-3xl sm:text-5xl lg:text-6xl select-none">
            &ldquo;
          </span>
          Invest the space. Understand human circulation, anticipate enterprise longevity, and commit unconditionally to micro-tolerance architectural brutalism.
          <span className="text-[#C5A880] font-serif not-italic ml-2 text-3xl sm:text-5xl lg:text-6xl select-none">
            &rdquo;
          </span>
        </motion.blockquote>

        {/* Refined supporting paragraph in #A1A1AA */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 max-w-2xl mx-auto text-sm sm:text-base text-[#A1A1AA] font-light leading-relaxed"
        >
          At OS Interiors, we refuse the disposable nature of standard office fit-outs. Every elevation, acoustic baffle, and book-matched walnut veneer is engineered as a generational architectural asset.
        </motion.p>

        {/* Fine signature line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-1.5"
        >
          <span className="h-[1px] w-12 bg-[#C5A880]/60 mb-2" />
          <span className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white">
            Studio Direction &bull; OS Interiors
          </span>
          <span className="font-serif italic text-xs text-[#C5A880]">
            Mumbai &bull; Indore &bull; Pan-India
          </span>
        </motion.div>
      </div>
    </section>
  );
}
