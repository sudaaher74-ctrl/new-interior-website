import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] text-white pt-20 pb-12 px-5 sm:px-8 border-t border-white/10">
      <div className="container-px">
        {/* Top Studio Presence Card */}
        <div className="rounded-[24px] bg-[#0E0E12] border border-white/10 p-8 sm:p-12 mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880]">
                National Turnkey Execution Reach
              </span>
            </div>
            <h3 className="font-display font-light text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
              Headquartered in Mumbai &bull; Turnkey Active in 10+ Metros
            </h3>
            <p className="text-sm text-[#A1A1AA] font-light mt-3 max-w-2xl leading-relaxed">
              Serving Mumbai, Navi Mumbai, Delhi NCR, Hyderabad, Bengaluru, Pune, and Indore with full on-site project management teams and dedicated joinery factories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href="mailto:contact@osinteriors.in"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black hover:bg-[#C5A880] text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-300 shadow-xl"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>contact@osinteriors.in</span>
            </a>
            <a
              href="tel:+918959173790"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/20 hover:border-white text-xs uppercase tracking-[0.14em] font-light text-white hover:bg-white/5 transition-all duration-300"
            >
              <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
              <span>+91 89591 73790</span>
            </a>
          </div>
        </div>

        {/* Multi-Column Link Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          {/* Col 1: Brand & Atelier Summary (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block group mb-5">
              <span className="font-display font-medium text-lg tracking-[0.2em] uppercase text-white group-hover:text-[#C5A880] transition-colors">
                OS <span className="text-[#C5A880]">INTERIOR</span>
              </span>
            </Link>
            <p className="text-sm text-[#A1A1AA] font-light leading-relaxed max-w-sm mb-6">
              Premier commercial and corporate interior design and contracting firm. Delivering high-performance office fit-outs, executive boardrooms, and bespoke atelier millwork across Mumbai and pan-India.
            </p>
            <div className="flex items-start gap-2.5 text-xs text-[#A1A1AA] font-light">
              <MapPin className="h-4 w-4 text-[#C5A880] shrink-0 mt-0.5" />
              <span>
                Headquarters &amp; Atelier: Kandivali West, Mumbai &bull; Serving Mumbai, Navi Mumbai &amp; Pan-India
              </span>
            </div>
          </div>

          {/* Col 2: Core Disciplines (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880] mb-5">
              Commercial Services
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-[#A1A1AA]">
              <li>
                <Link href="/services/corporate-interiors" className="hover:text-white transition-colors">
                  Corporate Interior Design
                </Link>
              </li>
              <li>
                <Link href="/services/commercial-interiors" className="hover:text-white transition-colors">
                  Commercial Interior Design
                </Link>
              </li>
              <li>
                <Link href="/services/office-interiors" className="hover:text-white transition-colors">
                  Office Interior Design
                </Link>
              </li>
              <li>
                <Link href="/services/turnkey-interiors" className="hover:text-white transition-colors">
                  Turnkey Interior Contracting
                </Link>
              </li>
              <li>
                <Link href="/services/office-fit-out" className="hover:text-white transition-colors">
                  Office Fit-Out Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/office-renovation" className="hover:text-white transition-colors">
                  Office Renovation &amp; Refits
                </Link>
              </li>
              <li>
                <Link href="/services/design-build" className="hover:text-white transition-colors">
                  Design &amp; Build Contracting
                </Link>
              </li>
              <li>
                <Link href="/services/workspace-planning" className="hover:text-white transition-colors">
                  Workspace Spatial Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Hubs & Case Studies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880] mb-5">
              Locations &amp; Projects
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-[#A1A1AA]">
              <li>
                <Link href="/locations/mumbai" className="hover:text-white transition-colors">
                  Mumbai Corporate Hub
                </Link>
              </li>
              <li>
                <Link href="/locations/kandivali" className="hover:text-white transition-colors">
                  Kandivali West HQ &amp; Studio
                </Link>
              </li>
              <li>
                <Link href="/locations/navi-mumbai" className="hover:text-white transition-colors">
                  Navi Mumbai Delivery Hub
                </Link>
              </li>
              <li>
                <Link href="/locations/andheri" className="hover:text-white transition-colors">
                  Andheri &amp; Sakinaka Hub
                </Link>
              </li>
              <li className="pt-2 border-t border-white/5">
                <Link href="/projects/netwin-ventures" className="hover:text-white transition-colors">
                  NETWIN Ventures (CBD Belapur)
                </Link>
              </li>
              <li>
                <Link href="/projects/bombay-barbeque" className="hover:text-white transition-colors">
                  Bombay Barbeque (Malad)
                </Link>
              </li>
              <li>
                <Link href="/projects/boomerang-park" className="hover:text-white transition-colors">
                  Boomerang Corporate Park (Andheri)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-[#C5A880] mb-5">
              Studio &amp; Insights
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-[#A1A1AA]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About OS Interior
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Commercial Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Advisory &amp; Cost Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#C5A880] hover:underline flex items-center gap-1 pt-1">
                  <span>Site Consultation</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Cormorant Garamond Architectural Motto */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-white/40">
          <p>&copy; {new Date().getFullYear()} OS Interiors Studio. All architectural rights reserved.</p>
          <p className="font-serif italic text-sm text-[#C5A880]">
            Investir l&apos;espace &bull; Progettare la Materia &bull; Architecture &amp; Craft
          </p>
        </div>
      </div>
    </footer>
  );
}
