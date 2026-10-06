import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, Clock, Tag, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BLOG_POSTS, SITE_URL } from '@/data/businessConfig';

export const metadata: Metadata = {
  title: 'Commercial Interior Insights & Guides | OS Interior Mumbai',
  description:
    'Expert B2B commercial interior guides for Mumbai business leaders. Commercial office cost per sq ft, Cat A vs B fit-outs, contractor selection & workspace planning.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Commercial Interior Insights & Guides | OS Interior Mumbai',
    description:
      'Executive guides on office interior costs, turnkey contracting due diligence, and workspace density planning in Mumbai.',
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-36 pb-24">
      {/* Radial Ambient Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#C5A880]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <div className="container-px relative z-10 mb-16 sm:mb-20">
        <Breadcrumbs
          items={[
            { name: 'Advisory Guides', path: '/blog' },
          ]}
        />

        <div className="max-w-4xl">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-3">
            ✦ B2B COMMERCIAL INTELLIGENCE ✦
          </span>
          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.05]">
            OFFICE INTERIOR <br />
            <span className="font-serif italic font-normal text-[#C5A880]">
              COSTS, STRATEGY &amp; DUE DILIGENCE
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-[#A1A1AA] font-light max-w-2xl leading-relaxed">
            Data-backed architectural guides for CEOs, founders, facility managers, and commercial procurement heads navigating corporate office fit-outs and turnkey contracting in Mumbai.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container-px relative z-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="rounded-[24px] bg-[#121216] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#C5A880]/50 transition-all duration-300 shadow-xl group"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/30" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-3.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/30">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-[#A1A1AA] mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#C5A880]" />
                      {post.readTime}
                    </span>
                    <span>&bull;</span>
                    <span>{post.author}</span>
                  </div>

                  <h2 className="font-display font-light text-2xl uppercase tracking-tight text-white group-hover:text-[#C5A880] transition-colors leading-snug mb-3">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white group-hover:text-[#C5A880] transition-colors"
                  >
                    Read Guide
                    <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Cross-Link Conversion Banner */}
      <div className="container-px relative z-10">
        <div className="rounded-[32px] bg-gradient-to-br from-[#18181E] via-[#121216] to-[#0D0D10] border border-[#C5A880]/30 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880] block mb-3">
            ✦ PLANNING A NEW MUMBAI OFFICE? ✦
          </span>
          <h2 className="font-display font-light text-3xl sm:text-4xl uppercase tracking-tight text-white mb-4">
            Request an Architectural Test-Fit &amp; Budget Review
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Send us your commercial floorplate or prospective address in Mumbai or Navi Mumbai. Our senior project directors will conduct a spatial density audit and prepare an itemized feasibility BOQ within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] bg-white text-black hover:bg-[#C5A880] transition-all duration-300 shadow-xl"
            >
              Discuss Your Commercial Project
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors"
            >
              Explore Turnkey Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
