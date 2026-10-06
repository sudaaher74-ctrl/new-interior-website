import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  Layers,
  Wrench,
  Clock,
  Compass,
  Phone,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SERVICES_CATALOG, SITE_URL, LOCATIONS_CATALOG } from '@/data/businessConfig';
import { ALL_PROJECTS } from '@/data/interiorData';
import { getServiceSchema, getFAQSchema } from '@/lib/seo';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SERVICES_CATALOG.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: 'Service Not Located | OS Interior',
    };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: [service.primaryKeyword, ...service.secondaryKeywords],
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${SITE_URL}/services/${service.slug}`,
      type: 'article',
      images: [
        {
          url: '/images/BelapurC2.webp',
          width: 1200,
          height: 630,
          alt: `${service.title} in Mumbai by OS Interior`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = getServiceSchema(service);
  const faqSchema = getFAQSchema(service.faqs);

  // Filter relevant projects
  const relevantProjects = ALL_PROJECTS.filter((p) =>
    service.relatedProjectSlugs.includes(p.slug)
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-36 pb-24">
      {/* Schema.org Service & FAQ Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]}
        />

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-[#C5A880] mb-4">
            <span>✦</span>
            <span>Commercial Interior Specialization</span>
          </div>

          <h1 className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.08]">
            {service.h1}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#D4D4D8] font-light leading-relaxed max-w-3xl">
            {service.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#C5A880] text-[#0A0A0B] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white transition-all shadow-xl"
            >
              <span>Consult on {service.shortTitle}</span>
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

      {/* Problems Solved */}
      <section className="container-px relative z-10 mb-20">
        <div className="rounded-[24px] bg-[#121216] border border-white/10 p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
              Industry Pitfalls Solved
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
              Challenges We Eliminate in {service.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.problemsSolved.map((problem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A880]/10 text-[#C5A880] shrink-0 font-display font-medium text-xs">
                  0{idx + 1}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#D4D4D8] font-light leading-relaxed">
                    {problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope of Work Breakdown */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-2">
            ✦ ENGINEERING DELIVERABLES ✦
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Comprehensive Scope of Work
          </h2>
          <p className="mt-3 text-sm text-[#A1A1AA] font-light">
            Every technical discipline is managed in-house to protect your project budget and completion schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {service.scopeOfWork.map((scope, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#121216] border border-white/10 p-8 flex flex-col justify-between hover:border-[#C5A880]/40 transition-all shadow-xl"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] block mb-2">
                  Scope Discipline 0{idx + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-tight text-white mb-2">
                  {scope.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed mb-6">
                  {scope.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <ul className="space-y-2 text-xs text-[#D4D4D8] font-light">
                  {scope.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Turnkey 4-Step Process */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="rounded-[24px] bg-[#0E0E12] border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
              Structured Execution
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
              The 4-Stage Turnkey Methodology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step) => (
              <div key={step.step} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-2xl font-display font-medium text-[#C5A880] block mb-3">
                  {step.step}
                </span>
                <h3 className="font-display text-base uppercase tracking-tight text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant Projects Showcase */}
      {relevantProjects.length > 0 && (
        <section className="container-px relative z-10 mb-20 sm:mb-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
                Verified Realizations
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
                Featured {service.shortTitle} Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-white uppercase tracking-wider font-medium"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relevantProjects.map((project) => (
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

      {/* Cross-linking to Regional Hubs */}
      <section className="container-px relative z-10 mb-20">
        <div className="rounded-2xl bg-[#121216] border border-white/10 p-8 sm:p-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
            Regional Service Delivery
          </span>
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white mb-4">
            Where We Deliver {service.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed max-w-3xl mb-6">
            From our core headquarters in Kandivali, we deploy dedicated turnkey site management crews across key commercial clusters:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LOCATIONS_CATALOG.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C5A880] hover:bg-white/10 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#C5A880] text-xs font-semibold mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{loc.name} Hub</span>
                  </div>
                  <span className="text-xs text-white font-light block">
                    {loc.primaryKeyword}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/40" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technical FAQ Accordion */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
            Common Inquiries on {service.shortTitle}
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl">
          {service.faqs.map((faq, idx) => (
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
              Direct Spatial Consultation
            </span>
            <h3 className="font-display font-light text-2xl sm:text-3xl text-white uppercase tracking-tight">
              DISCUSS YOUR UPCOMING {service.title.toUpperCase()} PROJECT
            </h3>
            <p className="mt-2 text-sm text-[#A1A1AA] font-light">
              Submit your floorplate dimensions or schedule a direct site audit with our principal project directors in Mumbai.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#C5A880] text-[#0A0A0B] px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white transition-all shadow-xl"
            >
              <span>Schedule Technical Consultation</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
