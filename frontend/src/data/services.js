// Single source of truth for what OS Interiors sells. The Services page renders
// all of it; Home, About, Process and Contact each pull the slice they need so
// the sectors, scope and capability wording never drift between pages.

export const SERVICE_CATEGORIES = [
  {
    n: '1',
    title: 'Commercial Interior Design',
    slug: 'commercial-interior-design',
    copy: 'Offices, HQs, startup offices, co-working, conference rooms, reception, executive cabins, meeting rooms.',
    short: 'HQs, startup floors, co-working, cabins, conference.',
    chips: ['Workplace', 'Cabins', 'Co-working'],
    projectType: 'Office / Corporate',
  },
  {
    n: '2',
    title: 'Restaurant Interior Design',
    slug: 'restaurant-interior-design',
    copy: 'Fine dining, cafés, bars, pubs, food courts, cloud kitchens, QSR, theme restaurants.',
    short: 'Fine dining, cafés, bars, QSR, cloud kitchens.',
    chips: ['Dining', 'Bars', 'QSR'],
    projectType: 'Restaurant / Café / Bar',
  },
  {
    n: '3',
    title: 'Retail & Showrooms',
    slug: 'retail-showrooms',
    copy: 'Fashion, jewellery, electronics, supermarkets, outlets, brand experience centres.',
    short: 'Fashion, jewellery, electronics, supermarkets, outlets.',
    chips: ['Outlets', 'Experience Centres'],
    projectType: 'Retail / Showroom',
  },
  {
    n: '4',
    title: 'Healthcare & Education',
    slug: 'healthcare-education',
    copy: 'Hospitals, clinics, IVF centres, diagnostic labs; universities, colleges, training centres, classrooms, computer labs.',
    short: 'Hospitals, clinics, IVF centres, universities, classrooms.',
    chips: ['Hospitals', 'Universities'],
    projectType: 'Healthcare / Education',
  },
];

// Ordered scope of a turnkey contract. `Final handover` is deliberately last —
// pages emphasise it as the closing step.
export const TURNKEY_SCOPE = [
  'Planning',
  'Design',
  '3D visualisation',
  'Budgeting',
  'Material procurement',
  'Civil work',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Painting',
  'Furniture',
  'Lighting',
  'Quality checks',
  'Cleaning',
  'Final handover',
];

export const CAPABILITIES = [
  {
    title: 'Fit-out solutions',
    slug: 'fit-out-solutions',
    copy: 'False ceiling, flooring, partitions, woodwork, furniture, glass, lighting, signage, reception, washrooms, cabins, conference, storage, pantry.',
    short: 'Ceilings, flooring, partitions, joinery, glass, lighting, signage.',
    img: '/images/IMG_2705.JPG',
  },
  {
    title: 'MEP services',
    slug: 'mep-services',
    copy: 'Mechanical, electrical, plumbing, HVAC, fire fighting, ventilation, drainage, panels, cable management, energy efficiency.',
    short: 'Mechanical, electrical, plumbing, HVAC and fire fighting, engineered in-house.',
    img: '/images/IMG_2702.JPG',
  },
  {
    title: 'Painting & exteriors',
    slug: 'painting-exteriors',
    copy: 'Interior/commercial/exterior painting, texture and premium finishes, protective and weather-resistant coatings, industrial systems, facades, elevation, ACP and stone cladding, waterproofing.',
    short: 'Facades, elevation, ACP and stone cladding, coatings, waterproofing.',
    img: '/images/IMG_2696.JPG',
  },
];

// Sectors we take work in, in the order we lead with them publicly.
export const SECTORS = [
  'Restaurants',
  'Corporate offices',
  'Retail',
  'Healthcare',
  'Education',
  'Hospitality',
];

// Contact-form options: the service categories plus the sectors that come in as
// enquiries but are not standalone categories on the Services page. Restaurants
// lead because they are the most common enquiry, so they stay the form default.
export const PROJECT_TYPES = [
  'Restaurant / Café / Bar',
  ...SERVICE_CATEGORIES.map((s) => s.projectType).filter((t) => t !== 'Restaurant / Café / Bar'),
  'Hospitality',
  'Residential luxury',
  'Exterior / Facade',
];
