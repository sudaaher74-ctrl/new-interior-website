const mongoose = require('mongoose');

const PortfolioProjectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  sector: { type: String },
  location: { type: String },
  meta: { type: String },
  img: { type: String, required: true }, // Main cover image URL
  scope: { type: String },
  status: { type: String, default: 'Completed' },
  delivered: [{ type: String }],
  body: [{ type: String }], // Array of paragraphs
  gallery: [{ type: String }], // Array of image URLs
  galleryWide: { type: String }, // Wide image URL
  altText: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PortfolioProject', PortfolioProjectSchema);
