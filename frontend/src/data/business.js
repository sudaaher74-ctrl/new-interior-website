import { SERVICE_CATEGORIES, CAPABILITIES } from './services';

// Canonical business facts, kept next to the service data so the structured
// data, the contact page and the footer can't drift apart.
export const BUSINESS = {
  name: 'OS Interiors',
  url: 'https://www.osinteriors.in',
  phone: '+91 8767067884',
  email: 'info@osinteriors.in',
  city: 'Mumbai',
  region: 'Maharashtra',
  country: 'IN',
  founded: '2014',
  hours: 'Mon–Sat, 10:00–19:00',
};

// Schema.org LocalBusiness record. `openingHoursSpecification` mirrors the
// "Mon–Sat, 10:00–19:00" shown on the contact page.
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: BUSINESS.name,
  url: BUSINESS.url,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  foundingDate: BUSINESS.founded,
  image: `${BUSINESS.url}/images/bombayB1.jpeg`,
  description:
    'Commercial interior and exterior contractor in Mumbai. Turnkey design, MEP and fit-out for restaurants, offices, retail, healthcare and education.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    addressCountry: BUSINESS.country,
  },
  areaServed: { '@type': 'City', name: BUSINESS.city },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Commercial interior services',
    itemListElement: [...SERVICE_CATEGORIES, ...CAPABILITIES].map((item) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: item.title, description: item.copy },
    })),
  },
};

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
});
