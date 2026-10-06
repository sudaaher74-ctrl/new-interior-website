'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_PROJECTS, ProjectItem } from '@/data/interiorData';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { MapPin, ArrowUpRight, X, CheckCircle2, Layers, Filter } from 'lucide-react';

const CATEGORIES = [
  'All Projects',
  'Corporate Offices',
  'Restaurants & Dining',
  'Luxury Retail',
  'Hospitality & Lounge',
  'Bespoke Joinery',
  'Exteriors & Facade',
];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string>('');

  // Handle URL query parameter if present
  useEffect(() => {
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

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

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Background radial glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <div className="container-px relative z-10 mb-12 sm:mb-16">
        <Breadcrumbs
          items={[
            { name: 'Projects', path: '/projects' },
          ]}
        />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.05]">
              COMMERCIAL INTERIOR <br />
              <span className="font-serif italic font-normal text-[#8F6E38]">PROJECTS &amp; CASE STUDIES</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-600 font-light max-w-2xl leading-relaxed">
              Explore our realized turnkey environments—from high-density corporate headquarters and iconic hospitality spaces to bespoke joinery fabrication across Mumbai, Navi Mumbai, and pan-India.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-6 sm:gap-8 bg-white border border-stone-200/90 rounded-2xl px-6 py-4 shrink-0 shadow-sm">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-medium text-[#8F6E38]">12+</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-0.5">Projects Realized</div>
            </div>
            <div className="h-8 w-[1px] bg-stone-200" />
            <div>
              <div className="text-2xl sm:text-3xl font-display font-medium text-[#0F0F12]">100%</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-0.5">Turnkey On-Time</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-stone-500 mr-2 shrink-0">
              <Filter className="h-3 w-3 text-[#8F6E38]" />
              Filter:
            </span>
            {CATEGORIES.map((category) => {
              const count =
                category === 'All Projects'
                  ? ALL_PROJECTS.length
                  : ALL_PROJECTS.filter((p) => p.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category
                      ? 'bg-[#8F6E38] text-white shadow-md font-semibold'
                      : 'bg-white text-stone-700 hover:text-[#0F0F12] border border-stone-200 hover:border-stone-300 shadow-sm'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeCategory === category ? 'bg-black/20 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500 uppercase tracking-[0.2em]">
            Showing <span className="text-[#8F6E38] font-semibold">{filteredProjects.length}</span> Spaces
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container-px relative z-10">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                layout
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer flex flex-col rounded-[20px] bg-white border border-stone-200/90 overflow-hidden hover:border-[#8F6E38]/50 transition-all duration-500 hover:shadow-xl shadow-sm"
              >
                {/* Project Image Container */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block rounded-full bg-white/95 backdrop-blur-md border border-stone-200 px-3 py-1 text-[11px] font-medium tracking-[0.16em] uppercase text-[#0F0F12] shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  {/* Scope Badge */}
                  {project.scope && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-block rounded-full bg-[#8F6E38]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-white shadow-sm">
                        {project.scope}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span>View Gallery &amp; Specs</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-light mb-2">
                      <MapPin className="h-3.5 w-3.5 text-[#8F6E38] shrink-0" />
                      <span>{project.location}</span>
                    </div>

                    <h3 className="font-display font-medium text-xl uppercase tracking-tight text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors">
                      {project.name}
                    </h3>

                    {project.description && (
                      <p className="mt-2.5 text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Deliverables Tags */}
                  {project.deliverables && project.deliverables.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {project.deliverables.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-600 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                      {project.deliverables.length > 3 && (
                        <span className="rounded-md bg-[#8F6E38]/10 px-2 py-0.5 text-[10px] text-[#8F6E38] font-medium">
                          +{project.deliverables.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                      {project.scope || 'Turnkey Scope'}
                    </span>
                    <Link
                      href={`/projects/${project.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#8F6E38] hover:text-[#0F0F12] uppercase tracking-wider text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Banner CTA */}
        <div className="mt-20 rounded-[24px] bg-[#F5F3EE] border border-stone-200/90 p-8 sm:p-12 relative overflow-hidden text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-2 block">
              Have a Specific Space in Mind?
            </span>
            <h3 className="font-display font-light text-2xl sm:text-3xl text-[#0F0F12] uppercase tracking-tight">
              COMMISSION AN ARCHITECTURAL CONSULTATION
            </h3>
            <p className="mt-2 text-sm text-stone-600 font-light leading-relaxed">
              Our studio directors will evaluate your floorplate, conduct feasibility audits, and formulate a turnkey execution proposal within 48 hours.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all duration-300 shadow-md"
            >
              <span>Initiate Project Consultation</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Project Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[24px] bg-white border border-stone-200 p-6 sm:p-8 lg:p-10 shadow-2xl z-10 text-[#0F0F12]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-700 hover:bg-[#0F0F12] hover:text-white transition-colors"
                aria-label="Close Project Modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Big Media Preview + Thumbnails (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 shadow-md">
                    <Image
                      src={activeModalImage || selectedProject.image}
                      alt={selectedProject.name}
                      fill
                      className="object-cover transition-all duration-500"
                      priority
                    />
                  </div>

                  {/* Multi-Angle Gallery Thumbnails */}
                  {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {selectedProject.gallery.map((thumbUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveModalImage(thumbUrl)}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                            (activeModalImage || selectedProject.image) === thumbUrl
                              ? 'border-[#8F6E38] scale-105 shadow-md'
                              : 'border-stone-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={thumbUrl}
                            alt={`${selectedProject.name} gallery ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Architectural Dossier & Inquire (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                  <div>
                    {/* Header info */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-[#8F6E38]/10 border border-[#8F6E38]/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#8F6E38] font-semibold">
                        {selectedProject.category}
                      </span>
                      {selectedProject.scope && (
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-stone-700 font-medium">
                          {selectedProject.scope}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display font-medium text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12] mt-3">
                      {selectedProject.name}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-light mt-2">
                      <MapPin className="h-3.5 w-3.5 text-[#8F6E38] shrink-0" />
                      <span>{selectedProject.location}</span>
                    </div>

                    {/* Description */}
                    {selectedProject.description && (
                      <div className="mt-5 pt-4 border-t border-stone-100">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#8F6E38] mb-2">
                          Architectural Brief
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>
                    )}

                    {/* Scope & Deliverables Checklist */}
                    {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-stone-100">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#8F6E38] mb-3">
                          Executed Deliverables
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-light">
                          {selectedProject.deliverables.map((d) => (
                            <li key={d} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#8F6E38] shrink-0" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-stone-100 space-y-3">
                    <Link
                      href={`/contact?project=${encodeURIComponent(selectedProject.name)}`}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F0F12] text-white py-3.5 text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#8F6E38] transition-all shadow-md"
                      onClick={() => setSelectedProject(null)}
                    >
                      <span>Inquire About This Space Typology</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/projects/${selectedProject.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 text-[#0F0F12] py-3 text-xs uppercase tracking-[0.16em] font-medium hover:border-[#8F6E38] hover:text-[#8F6E38] transition-all bg-white"
                      onClick={() => setSelectedProject(null)}
                    >
                      <span>Open Full Case Study Page</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-light">
                      <Layers className="h-3 w-3 text-[#8F6E38]" />
                      <span>Single-Point Contract &bull; Penalty-Backed Handover</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9]" />}>
      <ProjectsContent />
    </Suspense>
  );
}
