'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function EditorialCTA() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'Commercial Fit-Out',
    city: 'Mumbai',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[#0A0A0B] text-white py-24 md:py-36 px-5 sm:px-8 border-b border-white/10">
      {/* Background Architectural Photo with 20% Opacity */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20">
        <Image
          src="/images/bombayB2.webp"
          alt="Architectural space background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-[#0A0A0B]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0A0A0B]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow badge */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-4"
        >
          ✦ START THE CONVERSATION ✦
        </motion.span>

        {/* Master Heading Pairing */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <span className="font-display font-light text-[38px] sm:text-[56px] md:text-[72px] leading-[1.05] tracking-tight uppercase text-white block">
            A VISION? A PROJECT?
          </span>
          <span className="font-serif italic font-normal text-[38px] sm:text-[56px] md:text-[72px] text-[#C5A880] block mt-1">
            Let&apos;s talk about it.
          </span>
        </motion.h2>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base md:text-lg text-[#A1A1AA] font-light max-w-xl mx-auto leading-relaxed mb-12"
        >
          Whether expanding corporate headquarters, launching a flagship dining establishment, or commissioning custom architectural millwork—our leadership responds within 24 hours.
        </motion.p>

        {/* Consultation Form or Direct Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[28px] bg-[#121216]/90 border border-white/15 p-6 sm:p-10 backdrop-blur-xl shadow-2xl max-w-2xl mx-auto text-left"
        >
          {formSubmitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-[#C5A880] mb-4" />
              <h3 className="font-display font-light text-2xl uppercase tracking-wider text-white">
                Inquiry Received
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA] max-w-md font-light">
                Thank you for considering OS Interiors. Our Principal Project Director will review your spatial requirements and contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5 font-light">
                    Your Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Siddharth Mehta"
                    className="w-full rounded-xl bg-[#0A0A0B] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C5A880] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5 font-light">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl bg-[#0A0A0B] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C5A880] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5 font-light">
                    Discipline Required
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full rounded-xl bg-[#0A0A0B] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#C5A880] focus:outline-none transition-colors"
                  >
                    <option value="Commercial Fit-Out">Turnkey Commercial Fit-Out</option>
                    <option value="Architecture & Interior">Architecture &amp; Interior Design</option>
                    <option value="Luxury Hospitality & F&B">Luxury Hospitality &amp; Dining</option>
                    <option value="Bespoke Joinery & Millwork">Bespoke Millwork &amp; Furniture</option>
                    <option value="Luxury Residential">Private Luxury Residence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5 font-light">
                    Project Location / City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai / Delhi / Bengaluru / Indore"
                    className="w-full rounded-xl bg-[#0A0A0B] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C5A880] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5 font-light">
                  Estimated Area &amp; Key Details
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Approximate square footage, target completion timeline, and any special architectural conditions..."
                  className="w-full rounded-xl bg-[#0A0A0B] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#C5A880] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#0A0A0B] hover:bg-[#C5A880] text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Transmit Inquiry</span>
                </button>

                <a
                  href="tel:+918959173790"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-light text-[#C5A880] hover:text-white transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Direct Hotline: +91 89591 73790</span>
                </a>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
