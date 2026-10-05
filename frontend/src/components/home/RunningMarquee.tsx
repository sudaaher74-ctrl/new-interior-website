'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_PROJECTS, ProjectItem } from '@/data/interiorData';
import { MapPin, ArrowUpRight, X, CheckCircle2, Layers } from 'lucide-react';

const CATEGORIES = [
  'All Projects',
  'Corporate Offices',
  'Restaurants & Dining',
  'Luxury Retail',
  'Hospitality & Lounge',
  'Bespoke Joinery',
  'Exteriors & Facade',
];

export default function RunningMarquee() {
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string>('');

  // When a project modal opens, default active modal image to primary image
  useEffect(() => {
    if (selectedProject) {
      setActiveModalImage(selectedProject.image);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects =
    activeCategory === 'All Projects'
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeCategory);

  // Marquee projects array for the bottom ticker
  const tickerProjects = [...ALL_PROJECTS, ...ALL_PROJECTS];

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#0A0A0B] text-white py-20 md:py-32 border-b border-white/10"
    >
      {/* Background radial atmosphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C5A880]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="container-px mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] mb-3"
        >
          <span>✦</span>
          <span>ARCHITECTURAL REALIZATIONS</span>
          <span>✦</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display font-light text-[32px] sm:text-[46px] md:text-[56px] tracking-tight uppercase text-white block leading-[1.05]">
              CURATED PROJECTS
            </span>
            <span className="font-serif italic font-normal text-[32px] sm:text-[46px] md:text-[56px] text-[#C5A880]">
              built to endure.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm text-[#A1A1AA] max-w-md font-light leading-relaxed"
          >
            Explore our portfolio of corporate campuses, luxury dining venues, flagship retail spaces, and bespoke atelier millwork delivered across metropolitan hubs.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none"
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All Projects'
                ? ALL_PROJECTS.length
                : ALL_PROJECTS.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs uppercase tracking-[0.14em] transition-all duration-300 ${
                  isActive
                    ? 'bg-[#C5A880] text-[#0A0A0B] font-semibold shadow-[0_0_20px_rgba(197,168,128,0.35)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-light'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#0A0A0B]/20 text-[#0A0A0B]'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Projects Grid — All Projects Visible */}
      <div className="container-px">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer rounded-[24px] bg-[#121216]/90 p-4 border border-white/10 hover:border-[#C5A880]/60 transition-all duration-500 shadow-2xl flex flex-col justify-between"
              >
                {/* 16:10 Architectural Photo */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-black/40">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0A0A0B]/80 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-[0.16em] text-[#C5A880] font-medium">
                        {project.category}
                      </span>
                    </div>

                    {/* Quick View Pill */}
                    <div className="absolute bottom-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-[11px] font-semibold uppercase tracking-wider shadow-lg">
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="mt-4 px-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] font-light mb-1">
                      <MapPin className="w-3 h-3 text-[#C5A880]" />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="font-display font-medium text-lg sm:text-xl text-white uppercase tracking-wide group-hover:text-[#C5A880] transition-colors leading-tight">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="mt-2 text-xs text-[#A1A1AA] font-light leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Scope Deliverable Chips */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 px-1">
                  {project.deliverables?.slice(0, 3).map((del) => (
                    <span
                      key={del}
                      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[#A1A1AA] font-light"
                    >
                      {del}
                    </span>
                  ))}
                  {(project.deliverables?.length || 0) > 3 && (
                    <span className="text-[10px] text-[#C5A880] font-light">
                      +{(project.deliverables?.length || 0) - 3} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Marquee Ticker Ribbon — Kinetic Motion */}
      <div className="mt-20 pt-10 border-t border-white/5 relative w-full overflow-hidden">
        {/* Left / Right Gradient Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-32 bg-gradient-to-r from-[#0A0A0B] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-32 bg-gradient-to-l from-[#0A0A0B] to-transparent" />

        <div className="flex w-max animate-marquee-glide hover:[animation-play-state:paused]">
          {tickerProjects.map((p, idx) => (
            <div
              key={`${p.slug}-ticker-${idx}`}
              onClick={() => setSelectedProject(p)}
              className="group mx-3 cursor-pointer flex items-center gap-3 rounded-full bg-[#121216] px-5 py-2.5 border border-white/10 hover:border-[#C5A880]/60 transition-all shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span className="font-display text-xs uppercase tracking-wider text-white font-medium group-hover:text-[#C5A880] transition-colors">
                {p.name}
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-light uppercase tracking-wider">
                ({p.location})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Project Lightbox & Blueprint Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Content Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-[#0E0E12] border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-[#C5A880] transition-colors"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Photo Showcase */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-black/60 shadow-2xl">
                <Image
                  src={activeModalImage || selectedProject.image}
                  alt={selectedProject.name}
                  fill
                  sizes="1000px"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#0A0A0B]/80 backdrop-blur-md border border-white/15 text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails (if multiple images exist) */}
              {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                  {selectedProject.gallery.map((img, i) => (
                    <button
                      key={img + i}
                      type="button"
                      onClick={() => setActiveModalImage(img)}
                      className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        (activeModalImage || selectedProject.image) === img
                          ? 'border-[#C5A880] scale-105 shadow-md'
                          : 'border-white/15 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Project Meta & Narrative */}
              <div className="mt-6 sm:mt-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display font-medium text-2xl sm:text-3xl text-white uppercase tracking-wide">
                      {selectedProject.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-[#A1A1AA]">
                      <MapPin className="w-4 h-4 text-[#C5A880]" />
                      <span>{selectedProject.location}</span>
                      <span>&bull;</span>
                      <span className="text-[#C5A880]">{selectedProject.scope || 'Turnkey Execution'}</span>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.16em] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium self-start sm:self-auto">
                    Status: Handover Completed
                  </span>
                </div>

                {/* Narrative Description */}
                {selectedProject.description && (
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium block mb-2">
                      Architectural Blueprint
                    </span>
                    <p className="text-sm sm:text-base text-[#D4D4D8] font-light leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {/* Scope & Deliverables Checklist */}
                {selectedProject.deliverables && (
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium block mb-3">
                      Turnkey Scope Delivered
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProject.deliverables.map((del) => (
                        <div
                          key={del}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white/90"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer Call to Action */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#A1A1AA] font-light">
                    Interested in replicating similar architectural finishes for your space?
                  </span>
                  <Link
                    href="#contact"
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] bg-[#C5A880] text-[#0A0A0B] hover:bg-white transition-all shadow-xl"
                  >
                    Initiate Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
