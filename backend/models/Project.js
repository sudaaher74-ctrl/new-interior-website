const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clientName: { type: String },
  siteAddress: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  geofenceRadius: { type: Number, default: 100 }, // Default 100 meters
  budget: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Planning', 'Ongoing', 'On Hold', 'Completed', 'Upcoming'],
    default: 'Planning'
  },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.models.ErpProject || mongoose.model('ErpProject', ProjectSchema);
