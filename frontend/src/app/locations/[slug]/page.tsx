import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  Phone,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { LOCATIONS_CATALOG, SERVICES_CATALOG, SITE_URL, getLocationSchema, getFAQSchema } from '@/seo';
import { ALL_PROJECTS } from '@/data/interiorData';

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
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Soft Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <section className="container-px relative z-10 mb-16 sm:mb-20">
        <Breadcrumbs
          items={[
            { name: 'Locations', path: '/locations/mumbai' },
            { name: location.name, path: `/locations/${location.slug}` },
          ]}
        />

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs uppercase tracking-widest text-[#8F6E38] shadow-sm mb-4">
            <MapPin className="h-3 w-3" />
            <span>Serving {location.name} Commercial Corridors</span>
          </div>

          <h1 className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.08]">
            {location.h1}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            {location.coverageSummary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/contact?location=${encodeURIComponent(location.name)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md"
            >
              <span>Request {location.name} Site Visit</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+918959173790"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-medium text-[#0F0F12] hover:border-[#8F6E38] hover:text-[#8F6E38] transition-all bg-white shadow-sm"
            >
              <Phone className="h-3.5 w-3.5 text-[#8F6E38]" />
              <span>Call +91 89591 73790</span>
            </a>
          </div>
        </div>
      </section>

      {/* Business Corridors Served */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="rounded-[24px] bg-white border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
              Geographic Coverage
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
              Commercial &amp; Corporate Districts Served in {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {location.keyBusinessZones.map((zone, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#F5F3EE] border border-stone-200/80 flex items-start gap-3"
              >
                <CheckCircle2 className="h-4 w-4 text-[#8F6E38] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-stone-700 font-light">
                  {zone}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-3 text-xs text-stone-500 font-light">
            <MapPin className="h-4 w-4 text-[#8F6E38] shrink-0" />
            <span>
              Logistics Base: {location.logisticsHub}
            </span>
          </div>
        </div>
      </section>

      {/* Local Capabilities & Delivery Advantages */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-2">
            ✦ LOCAL PROJECT ADVANTAGES ✦
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0F0F12] uppercase tracking-tight">
            Why Commercial Clients in {location.name} Trust OS Interior
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {location.localCapabilities.map((cap, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-stone-200/90 p-6 flex flex-col justify-between hover:border-[#8F6E38]/50 hover:shadow-md transition-all shadow-sm"
            >
              <div>
                <span className="text-xl font-display font-medium text-[#8F6E38] block mb-2">
                  0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed">
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-1">
                Local Track Record
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
                Projects Executed in &amp; around {location.name}
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs text-[#8F6E38] hover:text-[#0F0F12] uppercase tracking-wider font-semibold"
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
                className="group rounded-2xl bg-white border border-stone-200/90 overflow-hidden hover:border-[#8F6E38]/50 hover:shadow-md transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#0F0F12] border border-stone-200 font-medium">
                      {project.location}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg uppercase tracking-tight text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
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
        <div className="rounded-[24px] bg-[#F5F3EE] border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
              Turnkey Contracting Scope
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
              Interior Services Available in {location.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES_CATALOG.map((srv) => (
              <Link
                key={srv.slug}
                href={`/services/${srv.slug}`}
                className="p-5 rounded-xl bg-white border border-stone-200/80 hover:border-[#8F6E38] hover:shadow-md transition-all flex items-center justify-between group shadow-sm"
              >
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors">
                    {srv.title}
                  </h3>
                  <span className="text-[11px] text-stone-500 font-light mt-0.5 block">
                    {srv.primaryKeyword}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-[#8F6E38] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location FAQs */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
            Local FAQs
          </span>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
            Common Questions for Projects in {location.name}
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl">
          {location.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-stone-200/90 p-6 sm:p-8 shadow-sm"
            >
              <h3 className="font-display text-base sm:text-lg uppercase tracking-tight text-[#0F0F12] mb-3">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="container-px relative z-10">
        <div className="rounded-[24px] bg-[#F5F3EE] border border-stone-200/90 p-8 sm:p-12 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-2 block">
              Site Inspection &amp; Consultation
            </span>
            <h3 className="font-display font-light text-2xl sm:text-3xl text-[#0F0F12] uppercase tracking-tight">
              SCHEDULE A SITE VISIT IN {location.name.toUpperCase()}
            </h3>
            <p className="mt-2 text-sm text-stone-600 font-light">
              Our site engineers and studio directors are available for prompt technical inspections across {location.name} business districts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={`/contact?location=${encodeURIComponent(location.name)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md"
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
