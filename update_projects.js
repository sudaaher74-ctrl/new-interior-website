const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/data/projects.js');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  {
    find: "galleryWide: '/images/IMG_2695.webp',",
    replace: "galleryWide: '/images/IMG_2695.webp',\n    altText: 'Modern turnkey restaurant interior for Bombay Barbeque in Malad with warm lighting and custom wood joinery',"
  },
  {
    find: "galleryWide: '/images/IMG_2702.webp',",
    replace: "galleryWide: '/images/IMG_2702.webp',\n    altText: 'Premium corporate office fit-out for NETWIN Ventures in CBD Belapur featuring modern workstations',"
  },
  {
    find: "galleryWide: '/images/IMG_2705.webp',",
    replace: "galleryWide: '/images/IMG_2705.webp',\n    altText: 'Dynamic restaurant interior for 99 Wok Street in Kandivali with custom lighting and seating',"
  },
  {
    find: "galleryWide: '/images/IMG_2698.webp',",
    replace: "galleryWide: '/images/IMG_2698.webp',\n    altText: 'Vibrant QSR outlet design for Juice Crush featuring bright signage and efficient counter space',"
  },
  {
    find: "galleryWide: '/images/carvan3.webp',",
    replace: "galleryWide: '/images/carvan3.webp',\n    altText: 'Elegant dining area for RadhaKrishna Cuisine in Bhayandar with traditional yet modern aesthetics',"
  },
  {
    find: "galleryWide: '/images/IMG_2701.webp',",
    replace: "galleryWide: '/images/IMG_2701.webp',\n    altText: 'Sophisticated hospitality interior at Boomerang Park in Sakinaka with premium MEP and lighting',"
  },
  {
    find: "galleryWide: '/images/IMG_2706.webp',",
    replace: "galleryWide: '/images/IMG_2706.webp',\n    altText: 'La Loco Grill restaurant interior in Thane featuring custom joinery and ambient lighting',"
  },
  {
    find: "galleryWide: '/images/caravab1.webp',",
    replace: "galleryWide: '/images/caravab1.webp',\n    altText: 'Caravan Menu restaurant in Thane showing premium turnkey interior finishing and seating arrangements',"
  },
  {
    find: "galleryWide: '/images/IMG_2696.webp',",
    replace: "galleryWide: '/images/IMG_2696.webp',\n    altText: 'Commercial exterior facade and ACP cladding elevation work in Mumbai by OS Interiors',"
  }
];

replacements.forEach(r => {
  content = content.replace(r.find, r.replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('projects.js updated with altText.');
