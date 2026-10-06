import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#F5F3EE] text-[#0F0F12] pt-20 pb-12 px-5 sm:px-8 border-t border-stone-200">
      <div className="container-px">
        {/* Top Studio Presence Card */}
        <div className="rounded-[24px] bg-white border border-stone-200 p-8 sm:p-12 mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#8F6E38] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38]">
                National Turnkey Execution Reach
              </span>
            </div>
            <h3 className="font-display font-light text-2xl sm:text-3xl lg:text-4xl text-[#0F0F12] uppercase tracking-tight">
              Headquartered in Mumbai &bull; Turnkey Active in 10+ Metros
            </h3>
            <p className="text-sm text-[#52525B] font-light mt-3 max-w-2xl leading-relaxed">
              Serving Mumbai, Navi Mumbai, Delhi NCR, Hyderabad, Bengaluru, Pune, and Indore with full on-site project management teams and dedicated joinery factories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href="mailto:contact@osinteriors.in"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0F0F12] text-white hover:bg-[#8F6E38] text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-300 shadow-sm"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>contact@osinteriors.in</span>
            </a>
            <a
              href="tel:+918959173790"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-stone-300 hover:border-stone-500 text-xs uppercase tracking-[0.14em] font-medium text-[#0F0F12] hover:bg-stone-50 transition-all duration-300"
            >
              <Phone className="h-3.5 w-3.5 text-[#8F6E38]" />
              <span>+91 89591 73790</span>
            </a>
          </div>
        </div>

        {/* Multi-Column Link Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-stone-200">
          {/* Col 1: Brand & Atelier Summary (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block group mb-5">
              <span className="font-display font-medium text-lg tracking-[0.2em] uppercase text-[#0F0F12] group-hover:text-[#8F6E38] transition-colors">
                OS <span className="text-[#8F6E38]">INTERIOR</span>
              </span>
            </Link>
            <p className="text-sm text-[#52525B] font-light leading-relaxed max-w-sm mb-6">
              Premier commercial and corporate interior design and contracting firm. Delivering high-performance office fit-outs, executive boardrooms, and bespoke atelier millwork across Mumbai and pan-India.
            </p>
            <div className="flex items-start gap-2.5 text-xs text-[#52525B] font-light">
              <MapPin className="h-4 w-4 text-[#8F6E38] shrink-0 mt-0.5" />
              <span>
                Headquarters &amp; Atelier: Kandivali West, Mumbai &bull; Serving Mumbai, Navi Mumbai &amp; Pan-India
              </span>
            </div>
          </div>

          {/* Col 2: Core Disciplines (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-5">
              Commercial Services
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-600">
              <li>
                <Link href="/services/corporate-interiors" className="hover:text-[#0F0F12] transition-colors">
                  Corporate Interior Design
                </Link>
              </li>
              <li>
                <Link href="/services/commercial-interiors" className="hover:text-[#0F0F12] transition-colors">
                  Commercial Interior Design
                </Link>
              </li>
              <li>
                <Link href="/services/office-interiors" className="hover:text-[#0F0F12] transition-colors">
                  Office Interior Design
                </Link>
              </li>
              <li>
                <Link href="/services/turnkey-interiors" className="hover:text-[#0F0F12] transition-colors">
                  Turnkey Interior Contracting
                </Link>
              </li>
              <li>
                <Link href="/services/office-fit-out" className="hover:text-[#0F0F12] transition-colors">
                  Office Fit-Out Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/office-renovation" className="hover:text-[#0F0F12] transition-colors">
                  Office Renovation &amp; Refits
                </Link>
              </li>
              <li>
                <Link href="/services/design-build" className="hover:text-[#0F0F12] transition-colors">
                  Design &amp; Build Contracting
                </Link>
              </li>
              <li>
                <Link href="/services/workspace-planning" className="hover:text-[#0F0F12] transition-colors">
                  Workspace Spatial Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Hubs & Case Studies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-5">
              Locations &amp; Projects
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-600">
              <li>
                <Link href="/locations/mumbai" className="hover:text-[#0F0F12] transition-colors">
                  Mumbai Corporate Hub
                </Link>
              </li>
              <li>
                <Link href="/locations/kandivali" className="hover:text-[#0F0F12] transition-colors">
                  Kandivali West HQ &amp; Studio
                </Link>
              </li>
              <li>
                <Link href="/locations/navi-mumbai" className="hover:text-[#0F0F12] transition-colors">
                  Navi Mumbai Delivery Hub
                </Link>
              </li>
              <li>
                <Link href="/locations/andheri" className="hover:text-[#0F0F12] transition-colors">
                  Andheri &amp; Sakinaka Hub
                </Link>
              </li>
              <li className="pt-2 border-t border-stone-200">
                <Link href="/projects/netwin-ventures" className="hover:text-[#0F0F12] transition-colors">
                  NETWIN Ventures (CBD Belapur)
                </Link>
              </li>
              <li>
                <Link href="/projects/bombay-barbeque" className="hover:text-[#0F0F12] transition-colors">
                  Bombay Barbeque (Malad)
                </Link>
              </li>
              <li>
                <Link href="/projects/boomerang-park" className="hover:text-[#0F0F12] transition-colors">
                  Boomerang Corporate Park (Andheri)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.25em] font-medium text-[#8F6E38] mb-5">
              Studio &amp; Insights
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-600">
              <li>
                <Link href="/about" className="hover:text-[#0F0F12] transition-colors">
                  About OS Interior
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0F0F12] transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#0F0F12] transition-colors">
                  Commercial Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#0F0F12] transition-colors">
                  Advisory &amp; Cost Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0F0F12] transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#8F6E38] hover:underline flex items-center gap-1 pt-1">
                  <span>Site Consultation</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Cormorant Garamond Architectural Motto */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-500">
          <p>&copy; {new Date().getFullYear()} OS Interiors Studio. All architectural rights reserved.</p>
          <p className="font-serif italic text-sm text-[#8F6E38]">
            Investir l&apos;espace &bull; Progettare la Materia &bull; Architecture &amp; Craft
          </p>
        </div>
      </div>
    </footer>
  );
}
