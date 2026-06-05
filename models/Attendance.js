const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'ErpProject' },
  date: { type: Date, required: true, default: Date.now },
  checkIn: {
    time: { type: Date },
    location: {
      lat: Number,
      lng: Number,
      accuracy: Number
    },
    selfieUrl: { type: String },
    deviceInfo: { type: String }
  },
  checkOut: {
    time: { type: Date },
    workSummary: { type: String },
    progressPhotos: [{ type: String }]
  },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Late Arrival', 'Early Departure', 'Half Day'],
    default: 'Absent'
  },
  totalWorkingHours: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
