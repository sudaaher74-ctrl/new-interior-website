export interface ProjectItem {
  name: string;
  location: string;
  category: string;
  image: string;
  slug: string;
}

export interface MetricItem {
  value: string;
  label: string;
  sub: string;
}

export interface ServiceItem {
  num: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  image: string;
  href: string;
}

export interface AdvantageItem {
  id: string;
  shape: 'square' | 'diamond' | 'triangle' | 'circle' | 'polygon' | 'hexagon';
  title: string;
  highlight: string;
  description: string;
}

export interface ReviewItem {
  quote: string;
  author: string;
  role: string;
  brand: string;
  city: string;
  highlight: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const METRICS: MetricItem[] = [
  {
    value: '120+',
    label: 'Projects Delivered',
    sub: 'Offices, luxury dining & high-end commercial spaces executed turnkey.',
  },
  {
    value: '12+',
    label: 'Years of Craft',
    sub: 'Proven track record in architecture, site engineering & bespoke millwork.',
  },
  {
    value: '50+',
    label: 'Enterprise Clients',
    sub: 'Trusted by luxury brands, tech corporations & visionary restaurateurs.',
  },
  {
    value: 'Pan-India',
    label: 'Execution Reach',
    sub: 'Active projects in Mumbai, Delhi NCR, Bengaluru, Hyderabad & Indore.',
  },
];

export const MARQUEE_PROJECTS: ProjectItem[] = [
  {
    name: 'BOMBAY BARBEQUE',
    location: 'Malad, Mumbai',
    category: 'Turnkey Hospitality',
    image: '/images/bombayB1.webp',
    slug: 'bombay-barbeque',
  },
  {
    name: 'NETWIN VENTURES',
    location: 'CBD Belapur',
    category: 'Corporate Headquarters',
    image: '/images/BelapurC2.webp',
    slug: 'netwin-ventures',
  },
  {
    name: '99 WOK STREET',
    location: 'Kandivali, Mumbai',
    category: 'Architectural F&B',
    image: '/images/Kandivali!.webp',
    slug: '99-wok-street',
  },
  {
    name: 'CARAVAN LOUNGE',
    location: 'Bandra, Mumbai',
    category: 'Hospitality & Dining',
    image: '/images/caravab1.webp',
    slug: 'caravan-lounge',
  },
  {
    name: 'JUICE CRUSH FLAGSHIP',
    location: 'South Mumbai',
    category: 'Luxury Retail',
    image: '/images/juice1.webp',
    slug: 'juice-crush',
  },
  {
    name: 'STUDIO AKAAI SUITE',
    location: 'Navi Mumbai',
    category: 'Commercial Spaces',
    image: '/images/IMG_2701.webp',
    slug: 'studio-akaai',
  },
  {
    name: 'ZENITH EXECUTIVE FLOORS',
    location: 'CBD Belapur',
    category: 'Grade-A Office',
    image: '/images/IMG_2702.webp',
    slug: 'zenith-floors',
  },
  {
    name: 'THE VELVET ATELIER',
    location: 'Worli, Mumbai',
    category: 'Bespoke Joinery',
    image: '/images/IMG_2695.webp',
    slug: 'velvet-atelier',
  },
];

export const SERVICES_TOTEM: ServiceItem[] = [
  {
    num: '01',
    phase: 'Phase 01',
    title: 'STRATEGY & SPATIAL MASTERPLANNING',
    subtitle: 'Data-Backed Circulation & Usage Analysis',
    description:
      'Before laying down physical lines, we rigorously evaluate your organizational rituals and human circulation. We model daylight exposure, acoustic density, and long-term operational scale to construct an intelligent spatial framework.',
    deliverables: [
      'Spatial circulation & density audit',
      'Zoning & acoustic boundary mapping',
      'Budget allocation & milestone roadmap',
      'Statutory & structural feasibility checks',
    ],
    image: '/images/BelapurC2.webp',
    href: '#contact',
  },
  {
    num: '02',
    phase: 'Phase 02',
    title: 'ARCHITECTURE & INTERIOR DESIGN',
    subtitle: 'Visceral Elegance & Functional Precision',
    description:
      'A great interior is a tailored instrument. We sculpt volumes with tactile material palettes—fluted stone, smoked oak, brushed champagne brass, and circadian lighting fixtures tailored specifically to enhance focus and mood.',
    deliverables: [
      'Photorealistic 3D architectural renders',
      'Curated tactile finishes & sample boards',
      'Detailed MEP, HVAC & technical schematics',
      'Custom lighting & acoustic design specs',
    ],
    image: '/images/bombayB1.webp',
    href: '#contact',
  },
  {
    num: '03',
    phase: 'Phase 03',
    title: 'TURNKEY FIT-OUT & CIVIL EXECUTION',
    subtitle: 'Single-Point Master Contractor Accountability',
    description:
      'From raw concrete slab to ribbon-cutting, we direct the entire site orchestra. Our licensed engineers manage demolition, structural steel, electrical panels, fire-suppression, acoustic ceilings, and micro-tolerance architectural finishes.',
    deliverables: [
      'Single-source prime contractor accountability',
      'Strict fire-life-safety & code adherence',
      'Live digital site log & weekly client briefs',
      'Guaranteed milestone delivery contract',
    ],
    image: '/images/IMG_2706.webp',
    href: '#contact',
  },
  {
    num: '04',
    phase: 'Phase 04',
    title: 'BESPOKE JOINERY & ARTIFACT FABRICATION',
    subtitle: 'Handcrafted Millwork & Integrated Elements',
    description:
      'Mass production has no place in fine architecture. In our dedicated fabrication atelier, master joiners build custom fluted reception counters, book-matched veneer paneling, acoustic slatted partitions, and architectural furniture that cannot be bought off a shelf.',
    deliverables: [
      'Bespoke architectural woodwork & millwork',
      'Champagne brass & metalwork fabrication',
      'Acoustic wall paneling & fluted partitions',
      'Factory-assembled precision installation',
    ],
    image: '/images/IMG_2695.webp',
    href: '#contact',
  },
];

export const CLIENT_ADVANTAGES: AdvantageItem[] = [
  {
    id: 'single-point',
    shape: 'square',
    title: 'Single-Point Accountability',
    highlight: 'Zero Contractor Friction',
    description:
      'One unified studio oversees design, engineering, procurement, and handover. No finger-pointing between architects and vendors.',
  },
  {
    id: 'factory-direct',
    shape: 'diamond',
    title: 'Factory-Direct Prefabrication',
    highlight: 'Concurrent Speed & Quality',
    description:
      'While civil works happen on-site, millwork and custom furniture are built concurrently in our factory, accelerating delivery by 35%.',
  },
  {
    id: 'material-integrity',
    shape: 'triangle',
    title: 'Genuine Material Integrity',
    highlight: 'Raw Travertine & Smoked Oak',
    description:
      'Direct sourcing of verified Italian marbles, solid architectural hardwoods, and custom brass alloys tested for longevity.',
  },
  {
    id: 'strict-deadlines',
    shape: 'circle',
    title: 'Penalty-Backed Timelines',
    highlight: 'Strict Delivery Certainty',
    description:
      'Clear contractual milestone schedules. We understand commercial rent burn and protect your launch deadlines at all costs.',
  },
  {
    id: 'acoustic-lighting',
    shape: 'polygon',
    title: 'Acoustic & Circadian Tuning',
    highlight: 'Sensory Comfort by Design',
    description:
      'Engineered decibel reduction and warm 2700K–3500K lighting layers that prevent fatigue and elevate visitor mood.',
  },
  {
    id: 'statutory-safety',
    shape: 'hexagon',
    title: 'Statutory & Fire NOC Compliance',
    highlight: 'Flawless Legal Handover',
    description:
      'End-to-end management of municipal permissions, fire-fighting clearances, and building management compliance.',
  },
];

export const CLIENT_REVIEWS: ReviewItem[] = [
  {
    quote:
      'OS Interiors transformed our 4,800 sq ft Malad space into a luxury dining destination on an extraordinary 30-day schedule. The coordination of MEP, exhaust ducting, and custom brass woodwork was executed with surgical precision.',
    author: 'Ankit Verma',
    role: 'Managing Director',
    brand: 'Bombay Barbeque',
    city: 'Mumbai',
    highlight: 'Delivered in 30 Days',
  },
  {
    quote:
      'Our corporate headquarters at CBD Belapur required an aesthetic that projected understated power to international investors. The acoustic zoning, natural oak partitions, and executive boardroom suite exceeded all expectations.',
    author: 'Siddharth Singhal',
    role: 'Partner & COO',
    brand: 'NETWIN Ventures',
    city: 'Navi Mumbai',
    highlight: 'Corporate Campus Fit-Out',
  },
  {
    quote:
      'From the raw structural shell to our opening night, OS Interiors demonstrated why single-point turnkey accountability matters. Their in-house joinery produced sculptural counters and light niches that our patrons admire daily.',
    author: 'Rajiv Nair',
    role: 'Co-Founder & Director',
    brand: 'Caravan Lounge & Rooftop',
    city: 'Mumbai',
    highlight: 'Hospitality Architecture',
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'What types of spaces does OS Interiors specialize in?',
    answer:
      'We specialize in turnkey commercial fit-outs and ultra-luxury residential spaces. This includes corporate headquarters, boutique financial offices, fine dining restaurants, luxury retail showrooms, and bespoke high-end residences. From bare-shell civil work to bespoke joinery and final handover, we oversee every square foot.',
  },
  {
    question: 'How do you guarantee fast timelines without compromising architectural quality?',
    answer:
      'We run parallel processing: while on-site civil, MEP, and HVAC infrastructure are being installed, our in-house millwork and joinery teams fabricate all custom furniture, wall panels, and metal elements concurrently at our facility. When the site reaches the finishing stage, installation happens rapidly with millimeter precision.',
  },
  {
    question: 'Do you manage execution in-house or outsource to third parties?',
    answer:
      'Our core strength is single-point accountability. We retain our own architectural planners, dedicated on-site civil engineers, MEP consultants, and an in-house fabrication workshop. You sign one contract and communicate with one dedicated Project Director throughout.',
  },
  {
    question: 'Can you work alongside external brand architects or global design manuals?',
    answer:
      'Absolutely. We frequently collaborate with international design studios, brand guidelines, and external design firms as their local executive architects and turnkey general contractors, ensuring global aesthetic benchmarks are matched with local statutory compliance.',
  },
  {
    question: 'What is the procedure for an initial spatial consultation and proposal?',
    answer:
      'We begin with a site visit or floorplan review to understand your circulation needs, operational requirements, and target timeline. Within 48 hours, we present a spatial layout concept, material palette, and an itemized transparent budget estimate.',
  },
];
