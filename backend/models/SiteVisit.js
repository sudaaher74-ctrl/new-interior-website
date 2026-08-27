const mongoose = require('mongoose');

const SiteVisitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'ErpProject', required: true },
  time: { type: Date, required: true, default: Date.now },
  location: {
    lat: Number,
    lng: Number,
    accuracy: Number
  },
  photoUrl: { type: String }, // Optional, historically Base64 or URL
  expenseAmount: { type: Number, default: 0 },
  expenseDescription: { type: String },
  expenseStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  expenseAdminComment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.SiteVisit || mongoose.model('SiteVisit', SiteVisitSchema);
