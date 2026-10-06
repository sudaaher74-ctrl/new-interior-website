import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ALL_PROJECTS } from '@/data/interiorData';
import { SITE_URL, SERVICES_CATALOG, LOCATIONS_CATALOG, getProjectSchema } from '@/seo';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Case Study Not Located | OS Interior',
    };
  }

  const title = `${project.name} — ${project.category} Project in ${project.location} | OS Interior`;
  const description =
    project.description ||
    `Turnkey ${project.category} interior project for ${project.name} in ${project.location} executed by OS Interior.`;

  return {
    title,
    description,
    keywords: [
      `${project.name} interior`,
      `${project.category} interior design`,
      `turnkey interior ${project.location}`,
      'commercial interior contractor Mumbai',
      'office interior case study',
    ],
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
      type: 'article',
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: `${project.name} — ${project.location} Interior by OS Interior`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const projectSchema = getProjectSchema(project);

  // Cross-link to matched service
  const matchedService = SERVICES_CATALOG.find(
    (s) => s.relatedProjectSlugs.includes(project.slug)
  ) || SERVICES_CATALOG[0];

  // Cross-link to matched location hub
  const matchedLocation = LOCATIONS_CATALOG.find(
    (l) => l.verifiedLocalProjects.includes(project.slug)
  ) || LOCATIONS_CATALOG[0];

  // Other related projects
  const relatedProjects = ALL_PROJECTS.filter(
    (p) => p.slug !== project.slug && p.category === project.category
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Schema.org CreativeWork Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      {/* Soft Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <section className="container-px relative z-10 mb-12 sm:mb-16">
        <Breadcrumbs
          items={[
            { name: 'Projects', path: '/projects' },
            { name: project.name, path: `/projects/${project.slug}` },
          ]}
        />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#8F6E38]/10 border border-[#8F6E38]/30 text-[10px] uppercase tracking-widest text-[#8F6E38] font-semibold">
                {project.category}
              </span>
              {project.scope && (
                <span className="px-3 py-1 rounded-full bg-stone-100 text-[10px] uppercase tracking-widest text-stone-700 font-medium">
                  {project.scope}
                </span>
              )}
            </div>

            <h1 className="font-display font-light text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#0F0F12] leading-[1.06]">
              {project.name}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-light mt-3">
              <MapPin className="h-4 w-4 text-[#8F6E38] shrink-0" />
              <span>{project.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/contact?project=${encodeURIComponent(project.name)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F0F12] text-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8F6E38] transition-all shadow-md"
            >
              <span>Commission Similar Space</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Project Hero Visual */}
      <section className="container-px relative z-10 mb-16 sm:mb-20">
        <div className="relative aspect-[16/9] w-full rounded-[24px] overflow-hidden border border-stone-200/90 shadow-lg bg-stone-100">
          <Image
            src={project.image}
            alt={`${project.name} interior architecture in ${project.location}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </div>
      </section>

      {/* Project Dossier & Details */}
      <section className="container-px relative z-10 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Architectural Brief & Deliverables (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F6E38] font-semibold block mb-2">
                Case Study Overview
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12] mb-4">
                Architectural Approach &amp; Scope
              </h2>
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                {project.description ||
                  `A complete turnkey interior fit-out executed under single-contract master accountability by OS Interior. The project combined space planning, licensed civil works, MEP engineering, and custom factory-manufactured millwork.`}
              </p>
            </div>

            {/* Deliverables Checklist */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="rounded-2xl bg-white border border-stone-200/90 p-8 shadow-sm">
                <h3 className="font-display text-lg uppercase tracking-tight text-[#0F0F12] mb-4">
                  Executed Deliverables &amp; Civil Scope
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 font-light">
                  {project.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#8F6E38] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Angle Photo Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h3 className="font-display text-xl uppercase tracking-tight text-[#0F0F12] mb-6">
                  Project Gallery &amp; Detail Angles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${project.name} photographic detail ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Meta Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[24px] bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-display text-lg uppercase tracking-tight text-[#0F0F12] pb-3 border-b border-stone-100">
                Project Dossier
              </h3>

              <div className="space-y-4 text-xs font-light">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                    Client / Establishment
                  </span>
                  <span className="text-sm font-medium text-[#0F0F12]">{project.name}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                    Location
                  </span>
                  <span className="text-sm font-medium text-[#0F0F12]">{project.location}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                    Typology
                  </span>
                  <span className="text-sm font-medium text-[#0F0F12]">{project.category}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                    Contract Model
                  </span>
                  <span className="text-sm font-medium text-[#8F6E38]">
                    Single-Point Turnkey Design &amp; Build
                  </span>
                </div>
              </div>

              {/* Contextual Cross-Links */}
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">
                  Related Specialization:
                </span>
                <Link
                  href={`/services/${matchedService.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#8F6E38] text-xs text-[#0F0F12] group transition-all"
                >
                  <span>{matchedService.title}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#8F6E38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium pt-2">
                  Regional Delivery Hub:
                </span>
                <Link
                  href={`/locations/${matchedLocation.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#8F6E38] text-xs text-[#0F0F12] group transition-all"
                >
                  <span>{matchedLocation.name} Commercial Hub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#8F6E38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* CTA Box */}
              <div className="pt-6 border-t border-stone-100">
                <Link
                  href={`/contact?project=${encodeURIComponent(project.name)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F0F12] text-white py-3 text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#8F6E38] transition-all shadow-md"
                >
                  <span>Inquire for Similar Space</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects in Category */}
      {relatedProjects.length > 0 && (
        <section className="container-px relative z-10 mb-20">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-[#0F0F12]">
              Related {project.category} Spaces
            </h2>
            <Link
              href="/projects"
              className="text-xs uppercase tracking-wider text-[#8F6E38] hover:text-[#0F0F12] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group rounded-2xl bg-white border border-stone-200/90 overflow-hidden hover:border-[#8F6E38]/50 hover:shadow-md transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base uppercase text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-xs text-stone-500 font-light mt-1 block">
                    {p.location}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
