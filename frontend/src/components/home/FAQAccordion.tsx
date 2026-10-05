'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS } from '@/data/interiorData';

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-[#0A0A0B] text-white py-24 md:py-36 px-5 sm:px-8 border-b border-white/10">
      <div className="container-px">
        {/* Section Header with Signature Formula */}
        <div className="max-w-3xl mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-3"
          >
            ✦ CLARITY &amp; DILIGENCE ✦
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] tracking-tight uppercase text-white block leading-[1.05]">
              FREQUENTLY POSED
            </span>
            <span className="font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] text-[#C5A880]">
              Questions.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-sm sm:text-base text-[#A1A1AA] font-light leading-relaxed"
          >
            Answers regarding our turnkey methodology, concurrent prefabrication schedules, and project director protocols.
          </motion.p>
        </div>

        {/* Minimalist Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[20px] bg-[#121216] border border-white/10 hover:border-[#C5A880]/40 overflow-hidden transition-all duration-300 shadow-lg"
              >
                {/* Accordion Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 select-none focus:outline-none group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-medium text-base sm:text-lg text-white tracking-wide uppercase leading-snug group-hover:text-[#C5A880] transition-colors">
                    {faq.question}
                  </span>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#181820] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white/10 group-hover:border-[#C5A880]/50 transition-colors">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {/* Animated Expand with Framer Motion AnimatePresence */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-8 sm:px-8 text-sm sm:text-base text-[#A1A1AA] font-light leading-relaxed border-t border-white/10 pt-5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
