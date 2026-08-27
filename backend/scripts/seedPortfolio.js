require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const PortfolioProject = require('../models/PortfolioProject');

const projects = [
  {
    slug: 'bombay-barbeque',
    title: 'Bombay Barbeque',
    category: 'Restaurants',
    sector: 'Restaurant',
    location: 'Malad',
    meta: 'Restaurant · Malad',
    img: '/images/bombayB1.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Joinery', 'Furniture', 'Lighting', 'Signage'],
    body: [
      'A turnkey full-service restaurant project where operational efficiency mattered as much as aesthetic impact. Covers and kitchen flow were planned first, so throughput was resolved before the dining experience was styled.',
      'Warm lighting, natural stone, wood and custom joinery were then brought into a single cohesive environment. Civil, electrical, plumbing, HVAC, fire fighting, acoustics, furniture and signage all ran under one contract, with a dedicated project manager reporting weekly to the client.',
    ],
    gallery: ['/images/bombayB2.webp', '/images/IMG_2706.webp'],
    galleryWide: '/images/IMG_2695.webp',
    altText: 'Modern turnkey restaurant interior for Bombay Barbeque in Malad with warm lighting and custom wood joinery',
  },
  {
    slug: 'netwin-ventures',
    title: 'NETWIN Ventures',
    category: 'Offices',
    sector: 'Corporate office',
    location: 'CBD Belapur',
    meta: 'Corporate office · CBD Belapur',
    img: '/images/BelapurC2.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Joinery', 'Furniture', 'Lighting'],
    body: [],
    gallery: ['/images/BelapurC3.webp', '/images/IMG_2701.webp'],
    galleryWide: '/images/IMG_2702.webp',
    altText: 'Premium corporate office fit-out for NETWIN Ventures in CBD Belapur featuring modern workstations',
  },
  {
    slug: '99-wok-street',
    title: '99 Wok Street',
    category: 'Restaurants',
    sector: 'Restaurant',
    location: 'Kandivali',
    meta: 'Restaurant · Kandivali',
    img: '/images/Kandivali!.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Joinery', 'Furniture', 'Lighting', 'Signage'],
    body: [],
    gallery: ['/images/caffe.webp', '/images/IMG_2697.webp'],
    galleryWide: '/images/IMG_2705.webp',
    altText: 'Dynamic restaurant interior for 99 Wok Street in Kandivali with custom lighting and seating',
  },
  {
    slug: 'juice-crush',
    title: 'Juice Crush',
    category: 'Retail',
    sector: 'QSR outlets',
    location: 'Kandivali & Kurla',
    meta: 'QSR outlets · Kandivali & Kurla',
    img: '/images/juice1.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'Joinery', 'Furniture', 'Lighting', 'Signage'],
    body: [],
    gallery: ['/images/juice2.webp', '/images/juice3.webp'],
    galleryWide: '/images/IMG_2698.webp',
    altText: 'Vibrant QSR outlet design for Juice Crush featuring bright signage and efficient counter space',
  },
  {
    slug: 'radhakrishna-cuisine',
    title: 'RadhaKrishna Cuisine',
    category: 'Restaurants',
    sector: 'Restaurant',
    location: 'Bhayandar',
    meta: 'Restaurant · Bhayandar',
    img: '/images/caffe.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Joinery', 'Furniture', 'Lighting'],
    body: [],
    gallery: ['/images/caravab1.webp', '/images/carvan2.webp'],
    galleryWide: '/images/carvan3.webp',
    altText: 'Elegant dining area for RadhaKrishna Cuisine in Bhayandar with traditional yet modern aesthetics',
  },
  {
    slug: 'boomerang-park',
    title: 'Boomerang Park',
    category: 'Hospitality',
    sector: 'Hospitality',
    location: 'Sakinaka',
    meta: 'Hospitality · Sakinaka',
    img: '/images/IMG_2698.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Furniture', 'Lighting'],
    body: [],
    gallery: ['/images/IMG_2697.webp', '/images/IMG_2702.webp'],
    galleryWide: '/images/IMG_2701.webp',
    altText: 'Sophisticated hospitality interior at Boomerang Park in Sakinaka with premium MEP and lighting',
  },
  {
    slug: 'la-loco-grill',
    title: 'La Loco Grill',
    category: 'Restaurants',
    sector: 'Restaurant',
    location: 'Thane',
    meta: 'Restaurant · Thane',
    img: '/images/bombayB2.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Joinery', 'Furniture', 'Lighting', 'Signage'],
    body: [],
    gallery: ['/images/bombayB1.webp', '/images/caffe.webp'],
    galleryWide: '/images/IMG_2706.webp',
    altText: 'La Loco Grill restaurant interior in Thane featuring custom joinery and ambient lighting',
  },
  {
    slug: 'caravan-menu',
    title: 'Caravan Menu',
    category: 'Restaurants',
    sector: 'Restaurant',
    location: 'Thane',
    meta: 'Restaurant · Thane',
    img: '/images/caravab1.webp',
    scope: 'Turnkey',
    status: 'Completed',
    delivered: ['Civil', 'MEP', 'Joinery', 'Furniture', 'Lighting'],
    body: [],
    gallery: ['/images/carvan2.webp', '/images/carvan3.webp'],
    galleryWide: '/images/caravab1.webp',
    altText: 'Caravan Menu restaurant in Thane showing premium turnkey interior finishing and seating arrangements',
  },
  {
    slug: 'exterior-facade-work',
    title: 'Exterior & Facade Work',
    category: 'Exteriors',
    sector: 'ACP cladding & elevation',
    location: 'Mumbai',
    meta: 'ACP cladding & elevation · Mumbai',
    img: '/images/IMG_2696.webp',
    scope: 'Exteriors',
    status: 'Completed',
    delivered: ['Cladding', 'Elevation', 'Waterproofing', 'Coatings'],
    body: [],
    gallery: ['/images/IMG_2695.webp', '/images/IMG_2705.webp'],
    galleryWide: '/images/IMG_2696.webp',
    altText: 'Commercial exterior facade and ACP cladding elevation work in Mumbai by OS Interiors',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');
    
    await PortfolioProject.deleteMany({});
    console.log('Cleared existing portfolio projects.');
    
    await PortfolioProject.insertMany(projects);
    console.log('Seeded portfolio projects successfully.');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
