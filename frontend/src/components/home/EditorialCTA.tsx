'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function EditorialCTA() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'Commercial Fit-Out',
    city: 'Mumbai',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          projectType: formData.projectType,
          requirement: formData.projectType,
          location: formData.city,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg || 'Unable to transmit your inquiry.');
      }

      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Lead error:', err);
      setErrorMessage(
        err.message || 'Submission encountered an issue. You can call or WhatsApp our Studio Director directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello OS Interiors Studio. I would like to discuss an architectural interior project.\nName: ${
      formData.name || 'Client'
    }\nPhone: ${formData.phone}\nType: ${formData.projectType}\nLocation: ${formData.city}`
  );

  return (
    <section id="contact" className="relative overflow-hidden bg-[#FAFAF9] text-[#0F0F12] py-24 md:py-36 px-5 sm:px-8 border-b border-stone-200/80">
      {/* Background Architectural Photo with 10% Opacity */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10">
        <Image
          src="/images/BelapurC2.webp"
          alt="Architectural space background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/80 to-[#FAFAF9]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow badge */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-4"
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
          <span className="font-display font-light text-[38px] sm:text-[56px] md:text-[72px] leading-[1.05] tracking-tight uppercase text-[#0F0F12] block">
            A VISION? A PROJECT?
          </span>
          <span className="font-serif italic font-normal text-[38px] sm:text-[56px] md:text-[72px] text-[#8F6E38] block mt-1">
            Let&apos;s talk about it.
          </span>
        </motion.h2>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base md:text-lg text-stone-600 font-light max-w-xl mx-auto leading-relaxed mb-12"
        >
          Whether expanding corporate headquarters, launching a flagship dining establishment, or commissioning custom architectural millwork—our leadership responds within 24 hours.
        </motion.p>

        {/* Consultation Form or Direct Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[28px] bg-white border border-stone-200/90 p-6 sm:p-10 shadow-xl max-w-2xl mx-auto text-left"
        >
          {formSubmitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-[#8F6E38] mb-4" />
              <h3 className="font-display font-light text-2xl uppercase tracking-wider text-[#0F0F12]">
                Inquiry Received
              </h3>
              <p className="mt-2 text-sm text-stone-600 max-w-md font-light mb-6">
                Thank you, <span className="font-semibold text-[#0F0F12]">{formData.name}</span>. Our Principal Project Director has received your inquiry and will reach out within 24 hours.
              </p>
              <a
                href={`https://wa.me/917700965189?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3 text-xs uppercase tracking-[0.14em] font-semibold hover:bg-emerald-700 transition-all shadow-md"
              >
                <span>Continue on WhatsApp Immediately</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="mt-1 text-amber-700">
                    Reach us directly on WhatsApp:{' '}
                    <a
                      href={`https://wa.me/917700965189?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold text-emerald-800"
                    >
                      +91 77009 65189
                    </a>
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                    Your Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Siddharth Mehta"
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder:text-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder:text-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                    Discipline Required
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="Commercial Fit-Out">Turnkey Commercial Fit-Out</option>
                    <option value="Architecture & Interior">Architecture &amp; Interior Design</option>
                    <option value="Luxury Hospitality & F&B">Luxury Hospitality &amp; Dining</option>
                    <option value="Bespoke Joinery & Millwork">Bespoke Millwork &amp; Furniture</option>
                    <option value="Luxury Residential">Private Luxury Residence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                    Project Location / City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai / Delhi / Bengaluru / Indore"
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder:text-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                  Estimated Area &amp; Key Details
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Approximate square footage, target completion timeline, and any special architectural conditions..."
                  className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder:text-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0F0F12] text-white hover:bg-[#8F6E38] text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Transmit Inquiry'}</span>
                </button>

                <a
                  href="tel:+917700965189"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-[#8F6E38] hover:text-[#0F0F12] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Direct Hotline: +91 77009 65189</span>
                </a>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
