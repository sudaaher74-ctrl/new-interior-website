'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  Send,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { FAQS } from '@/data/interiorData';

const PROJECT_TYPES = [
  'Corporate Office',
  'Restaurant & Dining',
  'Luxury Retail Flagship',
  'Hospitality & Lounge',
  'Bespoke Joinery & Millwork',
  'Turnkey Commercial Fit-Out',
];

const BUDGET_RANGES = [
  '₹25 Lakhs – ₹50 Lakhs',
  '₹50 Lakhs – ₹1 Crore',
  '₹1 Crore – ₹2.5 Crores',
  '₹2.5 Crores +',
];

function ContactContent() {
  const searchParams = useSearchParams();
  const requestedProject = searchParams.get('project');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Corporate Office',
    area: '',
    budget: '₹50 Lakhs – ₹1 Crore',
    location: 'Mumbai',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (requestedProject) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiring about project reference: ${requestedProject}. Please advise on feasibility, budget benchmarks, and preliminary timelines.`,
      }));
    }
  }, [requestedProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission delay and feedback
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello OS Interiors Studio. I would like to inquire about an architectural interior commission.\nName: ${
      formData.name || 'Client'
    }\nType: ${formData.projectType}\nLocation: ${formData.location}`
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Radial Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="container-px relative z-10 mb-12 sm:mb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] mb-4">
          <Link href="/" className="hover:text-[#0F0F12] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <span className="text-stone-600">Studio</span>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <span className="text-[#0F0F12] font-semibold">Contact &amp; Commission</span>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.05]">
            INITIATE A <br />
            <span className="font-serif italic font-normal text-[#8F6E38]">COMMISSION</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-light max-w-2xl leading-relaxed">
            Our studio directors and principal architects provide spatial feasibility reviews, circulation blueprints, and transparent turnkey budgets within 24 hours.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Form */}
      <div className="container-px relative z-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Studio Coordinates (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action Buttons */}
            <div className="rounded-[20px] bg-white border border-stone-200/90 p-6 sm:p-8 space-y-5 shadow-sm">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F6E38] block">
                Direct Contact Lines
              </span>

              <div className="space-y-4">
                <a
                  href="tel:+918959173790"
                  className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#8F6E38] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-[#8F6E38]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Call Direct</div>
                      <div className="text-sm font-semibold text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors">
                        +91 89591 73790
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-[#8F6E38] transition-colors" />
                </a>

                <a
                  href={`https://wa.me/918959173790?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">WhatsApp Direct</div>
                      <div className="text-sm font-medium text-emerald-950">Instant Consultation Chat</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                </a>

                <a
                  href="mailto:contact@osinteriors.in"
                  className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#8F6E38] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-[#8F6E38]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Email Atelier</div>
                      <div className="text-sm font-semibold text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors">
                        contact@osinteriors.in
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-[#8F6E38] transition-colors" />
                </a>
              </div>
            </div>

            {/* Physical Locations Card */}
            <div className="rounded-[20px] bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F6E38] block">
                Studio &amp; Workshop Coordinates
              </span>

              <div className="space-y-5 text-xs text-stone-600 font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#8F6E38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F12] block font-semibold uppercase tracking-wider text-[11px] mb-0.5">
                      Mumbai Headquarters &amp; Atelier
                    </strong>
                    Kandivali West, Mumbai, Maharashtra 400067
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-[#8F6E38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F12] block font-semibold uppercase tracking-wider text-[11px] mb-0.5">
                      Dedicated Millwork Atelier
                    </strong>
                    Kandivali Fabrication Workshop, Western Mumbai
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#8F6E38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F12] block font-semibold uppercase tracking-wider text-[11px] mb-0.5">
                      Key Project Service Corridors
                    </strong>
                    Serving businesses across Kandivali, Borivali, Malad, Goregaon, Andheri, BKC, Powai, Lower Parel, Thane &amp; Navi Mumbai (CBD Belapur, Vashi, Airoli).
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                  <Clock className="h-4 w-4 text-[#8F6E38] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F0F12] block font-semibold uppercase tracking-wider text-[11px] mb-0.5">
                      Operational Hours
                    </strong>
                    Monday – Saturday: 9:30 AM – 7:30 PM IST
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Guarantee Box */}
            <div className="rounded-[20px] bg-[#F5F3EE] border border-stone-200 p-6 flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-[#8F6E38] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#0F0F12] uppercase tracking-wider">
                  24-Hour Spatial Feasibility SLA
                </div>
                <div className="text-[11px] text-stone-600 font-light mt-0.5">
                  Share floorplans or site dimensions to receive preliminary layout options and budget projections.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Commission Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] bg-white border border-stone-200/90 p-8 sm:p-10 shadow-xl relative">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-[#8F6E38] mx-auto border border-[#8F6E38]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-2xl uppercase tracking-tight text-[#0F0F12]">
                      COMMISSION INQUIRY RECEIVED
                    </h3>
                    <p className="mt-2 text-sm text-stone-600 font-light max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-[#0F0F12] font-semibold">{formData.name}</span>. Our Studio Director has received your project parameters and will reach out within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={`https://wa.me/918959173790?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-6 py-3 text-xs uppercase tracking-[0.14em] font-semibold hover:bg-emerald-700 transition-all shadow-md"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Continue on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs uppercase tracking-[0.14em] text-stone-500 hover:text-black underline"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F6E38] block mb-1">
                      Project Dossier
                    </span>
                    <h3 className="font-display font-light text-2xl text-[#0F0F12] uppercase tracking-tight">
                      TELL US ABOUT YOUR SPACE
                    </h3>
                  </div>

                  {/* Typology Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-2 font-semibold">
                      Project Typology
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: type })}
                          className={`rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all ${
                            formData.projectType === type
                              ? 'bg-[#8F6E38] text-white font-semibold shadow-md'
                              : 'bg-stone-100 text-stone-700 hover:text-black border border-stone-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Singhania"
                        className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vikram@enterprise.com"
                        className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                        City / Metro *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Mumbai, Navi Mumbai, Pune"
                        className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Estimated Area & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                        Estimated Area (Sq. Ft.)
                      </label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="e.g. 4,500 sq ft"
                        className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                        Target Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                      >
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b} className="bg-white text-[#0F0F12]">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Scope / Notes */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-stone-700 mb-1.5 font-semibold">
                      Project Vision &amp; Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your timeline, desired hand-over date, key deliverables (e.g. civil, MEP, custom millwork), and current site condition (bare-shell, warm-shell, renovation)..."
                      className="w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-[#0F0F12] placeholder-stone-400 focus:border-[#8F6E38] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F0F12] text-white py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#8F6E38] transition-all shadow-md disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Transmitting Dossier...</span>
                    ) : (
                      <>
                        <span>Submit Architectural Inquiry</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-stone-500 font-light">
                    Direct confidential review by Principal Directors &bull; No third-party spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation FAQ Section */}
      <div className="container-px relative z-10 pt-10 border-t border-stone-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F6E38] block mb-2">
              Common Questions
            </span>
            <h2 className="font-display font-light text-2xl sm:text-3xl text-[#0F0F12] uppercase tracking-tight">
              SPATIAL CONSULTATION &amp; MOBILIZATION FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.slice(0, 4).map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-stone-200/90 p-6 space-y-2 shadow-sm"
              >
                <h4 className="font-display text-base font-semibold uppercase text-[#0F0F12]">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9]" />}>
      <ContactContent />
    </Suspense>
  );
}
