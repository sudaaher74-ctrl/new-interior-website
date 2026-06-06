const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  projectType: { type: String },
  message: { type: String },
  source: { type: String, default: 'Website Form' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  notes: [{
    text: String,
    system: Boolean,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
