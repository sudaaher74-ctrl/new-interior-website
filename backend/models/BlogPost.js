const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, default: 'OS Interiors' },
  content: { type: String, required: true }, // Markdown or HTML string
  coverImage: { type: String },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
