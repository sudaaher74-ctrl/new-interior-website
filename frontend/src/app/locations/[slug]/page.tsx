import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Phone,
  Wrench,
  Clock,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { LOCATIONS_CATALOG, SERVICES_CATALOG, SITE_URL, BUSINESS_INFO } from '@/data/businessConfig';
import { ALL_PROJECTS } from '@/data/interiorData';
import { getLocationSchema, getFAQSchema } from '@/lib/seo';

interface LocationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return LOCATIONS_CATALOG.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = LOCATIONS_CATALOG.find((l) => l.slug === slug);

  if (!location) {
    return {
      title: 'Location Not Found | OS Interior',
    };
  }

  return {
    title: location.metaTitle,
    description: location.metaDescription,
    keywords: [location.primaryKeyword, ...location.secondaryKeywords],
    alternates: {
      canonical: `/locations/${location.slug}`,
    },
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      url: `${SITE_URL}/locations/${location.slug}`,
      type: 'website',
      images: [
        {
          url: '/images/bombayB1.webp',
          width: 1200,
          height: 630,
          alt: `${location.title} by OS Interior`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: location.metaTitle,
      description: location.metaDescription,
    },
  };
}

export default async function LocationHubPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = LOCATIONS_CATALOG.find((l) => l.slug === slug);

  if (!location) {
    notFound();
  }

  const locationSchema = getLocationSchema(location);
  const faqSchema = getFAQSchema(location.faqs);

  // Filter projects verified in or near this location
  const localProjects = ALL_PROJECTS.filter((p) =>
    location.verifiedLocalProjects.includes(p.slug)
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-36 pb-24">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Radial Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#C5A880]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <section className="container-px relative z-10 mb-16 sm:mb-20">
        <Breadcrumbs
          items={[
            { name: 'Locations', path: '/locations/mumbai' },
            { name: location.name, path: `/locations/${location.slug}` },
          ]}
        />

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-[#C5A880] mb-4">
            <MapPin className="h-3 w-3" />
            <span>Serving {location.name} Commercial Corridors</span>
          </div>

          <h1 className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.08]">
            {location.h1}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#D4D4D8] font-light leading-relaxed max-w-3xl">
            {location.coverageSummary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/contact?location=${encodeURIComponent(location.name)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#C5A880] text-[#0A0A0B] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white transition-all shadow-xl"
            >
              <span>Request {location.name} Site Visit</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+918959173790"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-light text-white hover:border-[#C5A880] hover:text-[#C5A880] transition-all bg-[#121216]/50"
            >
              <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
              <span>Call +91 89591 73790</span>
            </a>
          </div>
        </div>
      </section>

      {/* Business Corridors Served */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="rounded-[24px] bg-[#121216] border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
              Geographic Coverage
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
              Commercial &amp; Corporate Districts Served in {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {location.keyBusinessZones.map((zone, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3"
              >
                <CheckCircle2 className="h-4 w-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#D4D4D8] font-light">
                  {zone}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-[#A1A1AA] font-light">
            <MapPin className="h-4 w-4 text-[#C5A880] shrink-0" />
            <span>
              Logistics Base: {location.logisticsHub}
            </span>
          </div>
        </div>
      </section>

      {/* Local Capabilities & Delivery Advantages */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-2">
            ✦ LOCAL PROJECT ADVANTAGES ✦
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Why Commercial Clients in {location.name} Trust OS Interior
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {location.localCapabilities.map((cap, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#121216] border border-white/10 p-6 flex flex-col justify-between hover:border-[#C5A880]/40 transition-all"
            >
              <div>
                <span className="text-xl font-display font-medium text-[#C5A880] block mb-2">
                  0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-[#D4D4D8] font-light leading-relaxed">
                  {cap}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Projects Executed in/near this Location */}
      {localProjects.length > 0 && (
        <section className="container-px relative z-10 mb-20 sm:mb-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
                Local Track Record
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
                Projects Executed in &amp; around {location.name}
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-white uppercase tracking-wider font-medium"
            >
              <span>Explore All Projects</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group rounded-2xl bg-[#121216] border border-white/10 overflow-hidden hover:border-[#C5A880]/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] uppercase tracking-wider text-white border border-white/15">
                      {project.location}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg uppercase tracking-tight text-white group-hover:text-[#C5A880] transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] font-light line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services Available in this Location */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="rounded-[24px] bg-[#0E0E12] border border-white/10 p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
              Turnkey Contracting Scope
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
              Interior Services Available in {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES_CATALOG.map((srv) => (
              <Link
                key={srv.slug}
                href={`/services/${srv.slug}`}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C5A880] hover:bg-white/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#C5A880] transition-colors">
                    {srv.title}
                  </h3>
                  <span className="text-[11px] text-[#A1A1AA] font-light mt-0.5 block">
                    {srv.primaryKeyword}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-[#C5A880] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location FAQs */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
            Local FAQs
          </span>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
            Common Questions for Projects in {location.name}
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl">
          {location.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#121216] border border-white/10 p-6 sm:p-8"
            >
              <h3 className="font-display text-base sm:text-lg uppercase tracking-tight text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="container-px relative z-10">
        <div className="rounded-[24px] bg-gradient-to-r from-[#181820] to-[#0E0E12] border border-white/15 p-8 sm:p-12 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880] mb-2 block">
              Site Inspection &amp; Consultation
            </span>
            <h3 className="font-display font-light text-2xl sm:text-3xl text-white uppercase tracking-tight">
              SCHEDULE A SITE VISIT IN {location.name.toUpperCase()}
            </h3>
            <p className="mt-2 text-sm text-[#A1A1AA] font-light">
              Our site engineers and studio directors are available for prompt technical inspections across {location.name} business districts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={`/contact?location=${encodeURIComponent(location.name)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#C5A880] text-[#0A0A0B] px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white transition-all shadow-xl"
            >
              <span>Request Technical Site Visit</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
