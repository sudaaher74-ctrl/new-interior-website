'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';

const SERVICES_MENU = [
  {
    title: 'Workplace Strategy & Fit-Out',
    desc: 'High-performance headquarters & turnkey commercial interiors',
    href: '#services',
  },
  {
    title: 'Architecture & Interior Design',
    desc: 'Spatial masterplanning, 3D visualizations & material curation',
    href: '#services',
  },
  {
    title: 'Turnkey Contracting & MEP',
    desc: 'Complete site execution, HVAC, civil work & single-point accountability',
    href: '#services',
  },
  {
    title: 'Bespoke Joinery & Millwork',
    desc: 'In-house atelier fabrication for luxury counters, panels & fixtures',
    href: '#services',
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500 pointer-events-none">
      <div
        className={`w-full transition-all duration-500 ${
          scrolled ? 'py-3 sm:py-4' : 'py-5 sm:py-6'
        }`}
      >
        <div className="container-px">
          <div className="relative flex items-center justify-between">
            {/* Floating Glass Pill Container */}
            <div className="pointer-events-auto flex w-full items-center justify-between rounded-full bg-[#0A0A0B]/85 backdrop-blur-md border border-white/15 px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl transition-all duration-300">
              {/* Studio Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-display font-medium text-sm sm:text-base tracking-[0.2em] uppercase text-white group-hover:text-[#C5A880] transition-colors">
                  OS <span className="text-[#C5A880]">INTERIORS</span>
                </span>
                <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880]/70" />
                <span className="hidden lg:inline-block text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA] font-light">
                  Architecture &amp; Build
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-7 lg:gap-9">
                <Link
                  href="/"
                  className="text-xs uppercase tracking-[0.14em] font-light text-white/80 hover:text-white transition-colors"
                >
                  Home
                </Link>

                {/* Services Dropdown */}
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-light text-white/80 hover:text-white transition-colors focus:outline-none"
                    aria-expanded={servicesOpen}
                  >
                    <span>Disciplines</span>
                    <ChevronDown
                      className={`h-3 w-3 text-[#C5A880] transition-transform duration-300 ${
                        servicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[340px]"
                      >
                        <div className="overflow-hidden rounded-2xl bg-[#0C0C10]/98 backdrop-blur-2xl border border-white/10 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                          <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C5A880]">
                              Core Specializations
                            </span>
                          </div>
                          {SERVICES_MENU.map((srv) => (
                            <Link
                              key={srv.title}
                              href={srv.href}
                              onClick={() => setServicesOpen(false)}
                              className="group block rounded-xl p-3 hover:bg-white/5 transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-display text-xs uppercase tracking-wider font-medium text-white group-hover:text-[#C5A880] transition-colors">
                                  {srv.title}
                                </span>
                                <ArrowUpRight className="h-3.5 w-3.5 text-white/40 group-hover:text-[#C5A880] transition-colors" />
                              </div>
                              <p className="mt-1 text-[11px] text-[#A1A1AA] font-light leading-relaxed">
                                {srv.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="#projects"
                  className="text-xs uppercase tracking-[0.14em] font-light text-white/80 hover:text-white transition-colors"
                >
                  Portfolio
                </Link>

                <Link
                  href="#philosophy"
                  className="text-xs uppercase tracking-[0.14em] font-light text-white/80 hover:text-white transition-colors"
                >
                  Philosophy
                </Link>

                <Link
                  href="#faq"
                  className="text-xs uppercase tracking-[0.14em] font-light text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </nav>

              {/* Right CTA Button & Mobile Trigger */}
              <div className="flex items-center gap-3">
                <Link
                  href="#contact"
                  className="hidden sm:inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] bg-white text-black hover:bg-[#C5A880] hover:text-[#0A0A0B] transition-all duration-300 shadow-md"
                >
                  Initiate Project
                </Link>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:text-[#C5A880] transition-colors"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto fixed inset-x-4 top-20 z-50 md:hidden overflow-hidden rounded-[24px] bg-[#0A0A0B]/98 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-medium">
                Navigation
              </span>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm uppercase tracking-[0.16em] text-white hover:text-[#C5A880] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="#services"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm uppercase tracking-[0.16em] text-white hover:text-[#C5A880] transition-colors"
                >
                  Disciplines &amp; Services
                </Link>
                <Link
                  href="#projects"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm uppercase tracking-[0.16em] text-white hover:text-[#C5A880] transition-colors"
                >
                  Selected Projects
                </Link>
                <Link
                  href="#philosophy"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm uppercase tracking-[0.16em] text-white hover:text-[#C5A880] transition-colors"
                >
                  Architecture Philosophy
                </Link>
                <Link
                  href="#reviews"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm uppercase tracking-[0.16em] text-white hover:text-[#C5A880] transition-colors"
                >
                  Client Reviews
                </Link>
                <Link
                  href="#faq"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm uppercase tracking-[0.16em] text-white hover:text-[#C5A880] transition-colors"
                >
                  Inquiries &amp; FAQ
                </Link>
              </nav>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-[#C5A880] text-[#0A0A0B] py-3 text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white transition-all shadow-xl"
                >
                  Talk To Our Studio
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
