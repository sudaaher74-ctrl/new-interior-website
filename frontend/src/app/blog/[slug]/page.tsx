import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  ArrowRight,
  Building2,
  MapPin,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BLOG_POSTS, SERVICES_CATALOG, LOCATIONS_CATALOG, SITE_URL, getArticleSchema, getBreadcrumbSchema } from '@/seo';
import { ALL_PROJECTS } from '@/data/interiorData';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Article Not Found | OS Interior',
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedService = SERVICES_CATALOG.find((s) => s.slug === post.relatedServiceSlug);
  const relatedLocation = LOCATIONS_CATALOG.find((l) => l.slug === post.relatedLocationSlug);
  const relatedProject = ALL_PROJECTS.find((p) => p.slug === post.relatedProjectSlug);

  const articleSchema = getArticleSchema(post);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Advisory Guides', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] pt-28 sm:pt-36 pb-24">
      {/* Article & Breadcrumb Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Soft Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#8F6E38]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <div className="container-px relative z-10 mb-12 sm:mb-16">
        <Breadcrumbs
          items={[
            { name: 'Advisory Guides', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />

        <div className="max-w-4xl mt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-[#8F6E38]/10 border border-[#8F6E38]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#8F6E38]">
              {post.category}
            </span>
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#8F6E38]" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#0F0F12] leading-tight mb-6">
            {post.h1}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          <div className="mt-6 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
            <div>
              <span className="text-stone-400 uppercase tracking-widest block text-[10px] mb-1">Authored By</span>
              <span className="text-[#0F0F12] font-medium">{post.author}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-widest block text-[10px] mb-1">Updated</span>
              <time dateTime={post.modifiedDate}>March 2026</time>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Header Image */}
      <div className="container-px relative z-10 mb-16">
        <div className="relative h-72 sm:h-96 lg:h-[480px] w-full rounded-[24px] overflow-hidden border border-stone-200/90 shadow-lg bg-stone-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="container-px relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents & Cross Links (4 Cols) */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">
              {/* Table of Contents Box */}
              <div className="rounded-[20px] bg-white border border-stone-200/90 p-6 shadow-sm">
                <h2 className="font-display font-light text-base uppercase tracking-wider text-[#0F0F12] mb-4 flex items-center gap-2">
                  <span className="text-[#8F6E38]">✦</span> Guide Contents
                </h2>
                <nav className="space-y-2.5 text-xs text-stone-600">
                  {post.tableOfContents.map((toc) => (
                    <a
                      key={toc.id}
                      href={`#${toc.id}`}
                      className="block hover:text-[#8F6E38] transition-colors py-1 leading-snug border-l border-stone-200 pl-3 hover:border-[#8F6E38]"
                    >
                      {toc.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Related Service Cross-Link */}
              {relatedService && (
                <div className="rounded-[20px] bg-white border border-stone-200/90 p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8F6E38] mb-2">
                    <Building2 className="h-4 w-4" />
                    Relevant Service
                  </div>
                  <h3 className="font-display font-light text-base text-[#0F0F12] mb-2">
                    {relatedService.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {relatedService.excerpt}
                  </p>
                  <Link
                    href={`/services/${relatedService.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8F6E38] hover:text-[#0F0F12] transition-colors"
                  >
                    View Service Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Related Location Cross-Link */}
              {relatedLocation && (
                <div className="rounded-[20px] bg-white border border-stone-200/90 p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8F6E38] mb-2">
                    <MapPin className="h-4 w-4" />
                    Target Hub
                  </div>
                  <h3 className="font-display font-light text-base text-[#0F0F12] mb-2">
                    {relatedLocation.name} Operations
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {relatedLocation.coverageSummary}
                  </p>
                  <Link
                    href={`/locations/${relatedLocation.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8F6E38] hover:text-[#0F0F12] transition-colors"
                  >
                    Explore {relatedLocation.name} Projects <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Related Case Study */}
              {relatedProject && (
                <div className="rounded-[20px] bg-white border border-stone-200/90 p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8F6E38] mb-2">
                    <Briefcase className="h-4 w-4" />
                    Case Study Evidence
                  </div>
                  <h3 className="font-display font-light text-base text-[#0F0F12] mb-2">
                    {relatedProject.name}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {relatedProject.description}
                  </p>
                  <Link
                    href={`/projects/${relatedProject.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8F6E38] hover:text-[#0F0F12] transition-colors"
                  >
                    Inspect Full Case Study <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Guide Sections (8 Cols) */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="font-display font-light text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12] mb-5 pb-3 border-b border-stone-200">
                  {section.heading}
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-stone-700 font-light leading-relaxed">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Optional Table */}
                {section.table && (
                  <div className="mt-6 overflow-x-auto rounded-[16px] border border-stone-200 bg-white shadow-sm">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[#0F0F12] font-semibold">
                        <tr>
                          {section.table.headers.map((th, thIdx) => (
                            <th key={thIdx} className="p-3.5 sm:p-4">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-600">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-50/60">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3.5 sm:p-4 leading-relaxed">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Optional Callout / TBD Box */}
                {section.callout && (
                  <div className="mt-6 rounded-[16px] bg-[#F5F3EE] border border-[#8F6E38]/40 p-5 flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-[#8F6E38] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8F6E38] mb-1">
                        {section.callout.title}
                      </h3>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {section.callout.text}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            ))}

            {/* Bottom Conversion Box */}
            <div className="rounded-[24px] bg-[#F5F3EE] border border-stone-200/90 p-8 sm:p-10 shadow-sm text-center">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8F6E38] block mb-2">
                ✦ COMMERCIAL INTERIOR CONSULTATION ✦
              </span>
              <h2 className="font-display font-light text-2xl sm:text-3xl uppercase tracking-tight text-[#0F0F12] mb-3">
                Need Verified BOQ Pricing for Your Mumbai Space?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl mx-auto mb-6 leading-relaxed">
                OS Interior engineers turnkey corporate offices, executive suites, and dining venues across Mumbai, Kandivali, Andheri, and Navi Mumbai. Contact our principal directors for an itemized feasibility budget.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] bg-[#0F0F12] text-white hover:bg-[#8F6E38] transition-all duration-300 shadow-md"
                >
                  Request Feasibility Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/projects"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] bg-white text-[#0F0F12] hover:border-[#8F6E38] hover:text-[#8F6E38] border border-stone-300 transition-colors shadow-sm"
                >
                  Browse Case Studies
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
