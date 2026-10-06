import { BUSINESS_INFO, SITE_URL, ServiceDetail, LocationDetail, BlogPost } from '@/data/businessConfig';
import { ProjectItem } from '@/data/interiorData';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    alternateName: [BUSINESS_INFO.brandName, BUSINESS_INFO.alternateName],
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/images/bombayB1.webp`,
    description:
      'Premier commercial interior designers and turnkey contracting firm in Mumbai. Specializing in corporate offices, executive boardrooms, commercial fit-outs, and bespoke atelier millwork.',
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    foundingDate: `${BUSINESS_INFO.foundingYear}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    openingHoursSpecification: BUSINESS_INFO.openingHoursSpecification.map((spec) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes,
    })),
    areaServed: [
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Navi Mumbai' },
      { '@type': 'City', name: 'Thane' },
      { '@type': 'AdministrativeArea', name: 'Maharashtra' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: [
      'Corporate Interior Design',
      'Commercial Interior Design',
      'Turnkey Interior Contracting',
      'Office Fit-Out (Category A & B)',
      'Office Renovation & Refurbishment',
      'Workspace Spatial Planning',
      'Mechanical, Electrical & Plumbing (MEP) Engineering',
      'HVAC Systems & Acoustics',
      'Bespoke Joinery & Millwork',
    ],
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS_INFO.name,
    image: `${SITE_URL}/images/BelapurC2.webp`,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    url: SITE_URL,
    priceRange: BUSINESS_INFO.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: 'Kandivali, Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400067',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    openingHoursSpecification: BUSINESS_INFO.openingHoursSpecification,
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, Cheque',
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function getServiceSchema(service: ServiceDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: [
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Navi Mumbai' },
      { '@type': 'City', name: 'Thane' },
    ],
    description: service.metaDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title} Deliverables`,
      itemListElement: service.scopeOfWork.map((scope) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: scope.title,
          description: scope.description,
        },
      })),
    },
  };
}

export function getLocationSchema(location: LocationDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${BUSINESS_INFO.name} — Serving ${location.name}`,
    description: location.metaDescription,
    url: `${SITE_URL}/locations/${location.slug}`,
    telephone: BUSINESS_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: location.name,
    },
    parentOrganization: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function getProjectSchema(project: ProjectItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    headline: `${project.name} — ${project.category} Project in ${project.location}`,
    description: project.description || `Commercial interior project executed by OS Interior in ${project.location}.`,
    image: `${SITE_URL}${project.image}`,
    url: `${SITE_URL}/projects/${project.slug}`,
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    creator: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(article: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.h1,
    description: article.metaDescription,
    image: `${SITE_URL}${article.image}`,
    author: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  };
}
