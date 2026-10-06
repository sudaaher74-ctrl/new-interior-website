'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Guides', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  // Check if link is currently active
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/services') {
      return pathname.startsWith('/services');
    }
    if (href === '/projects') {
      return pathname.startsWith('/project');
    }
    if (href === '/blog') {
      return pathname.startsWith('/blog');
    }
    if (href === '/about') {
      return pathname.startsWith('/about');
    }
    if (href === '/contact') {
      return pathname.startsWith('/contact');
    }
    return pathname.startsWith(href);
  };

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

              {/* Desktop Nav Links: Home, Project, About Us, Contact */}
              <nav className="hidden md:flex items-center gap-7 lg:gap-9">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`relative py-1 text-xs uppercase tracking-[0.16em] transition-colors ${
                        active
                          ? 'text-[#C5A880] font-medium'
                          : 'text-white/80 hover:text-[#C5A880] font-light'
                      }`}
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#C5A880]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right CTA Button & Mobile Trigger */}
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
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
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`py-2.5 text-sm uppercase tracking-[0.16em] transition-colors flex items-center justify-between ${
                        active
                          ? 'text-[#C5A880] font-medium'
                          : 'text-white hover:text-[#C5A880]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/contact"
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
