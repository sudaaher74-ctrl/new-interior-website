import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Phone,
  MapPin,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SERVICES_CATALOG, SITE_URL, LOCATIONS_CATALOG, getServiceSchema, getFAQSchema } from '@/seo';
import { ALL_PROJECTS } from '@/data/interiorData';

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
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Schema.org Service & FAQ Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]}
        />

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs uppercase tracking-widest text-[#8F6E38] shadow-sm mb-4">
            <span>✦</span>
            <span>Commercial Interior Specialization</span>
          </div>

          <h1 className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.08]">
            {service.h1}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
            {service.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md"
            >
              <span>Consult on {service.shortTitle}</span>
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

      {/* Problems Solved */}
      <section className="container-px relative z-10 mb-20">
        <div className="rounded-[24px] bg-white border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
              Industry Pitfalls Solved
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
              Challenges We Eliminate in {service.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.problemsSolved.map((problem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F5F3EE] border border-stone-200/80 flex items-start gap-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8F6E38]/15 text-[#8F6E38] shrink-0 font-display font-medium text-xs">
                  0{idx + 1}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed">
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
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-2">
            ✦ ENGINEERING DELIVERABLES ✦
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0F0F12] uppercase tracking-tight">
            Comprehensive Scope of Work
          </h2>
          <p className="mt-3 text-sm text-stone-600 font-light">
            Every technical discipline is managed in-house to protect your project budget and completion schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {service.scopeOfWork.map((scope, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-stone-200/90 p-8 flex flex-col justify-between hover:border-[#8F6E38]/50 hover:shadow-md transition-all shadow-sm"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8F6E38] block mb-2">
                  Scope Discipline 0{idx + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-tight text-[#0F0F12] mb-2">
                  {scope.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
                  {scope.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <ul className="space-y-2 text-xs text-stone-700 font-light">
                  {scope.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#8F6E38] shrink-0 mt-0.5" />
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
        <div className="rounded-[24px] bg-[#F5F3EE] border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
              Structured Execution
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
              The 4-Stage Turnkey Methodology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step) => (
              <div key={step.step} className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
                <span className="text-2xl font-display font-medium text-[#8F6E38] block mb-3">
                  {step.step}
                </span>
                <h3 className="font-display text-base uppercase tracking-tight text-[#0F0F12] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-1">
                Verified Realizations
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
                Featured {service.shortTitle} Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs text-[#8F6E38] hover:text-[#0F0F12] uppercase tracking-wider font-semibold"
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

      {/* Cross-linking to Regional Hubs */}
      <section className="container-px relative z-10 mb-20">
        <div className="rounded-2xl bg-white border border-stone-200/90 p-8 sm:p-10 shadow-sm">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
            Regional Service Delivery
          </span>
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-[#0F0F12] mb-4">
            Where We Deliver {service.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-3xl mb-6">
            From our core headquarters in Kandivali, we deploy dedicated turnkey site management crews across key commercial clusters:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LOCATIONS_CATALOG.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#8F6E38] hover:bg-stone-100/70 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#8F6E38] text-xs font-semibold mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{loc.name} Hub</span>
                  </div>
                  <span className="text-xs text-stone-700 font-light block">
                    {loc.primaryKeyword}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-stone-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technical FAQ Accordion */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12]">
            Common Inquiries on {service.shortTitle}
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl">
          {service.faqs.map((faq, idx) => (
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
              Direct Spatial Consultation
            </span>
            <h3 className="font-display font-light text-2xl sm:text-3xl text-[#0F0F12] uppercase tracking-tight">
              DISCUSS YOUR UPCOMING {service.title.toUpperCase()} PROJECT
            </h3>
            <p className="mt-2 text-sm text-stone-600 font-light">
              Submit your floorplate dimensions or schedule a direct site audit with our principal project directors in Mumbai.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md"
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
