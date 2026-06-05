const mongoose = require('mongoose');

const WorkReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  date: { type: Date, required: true, default: Date.now },
  workCompleted: { type: String, required: true },
  materialUsed: { type: String },
  workersPresent: { type: Number },
  issuesFound: { type: String },
  clientFeedback: { type: String },
  tomorrowPlan: { type: String },
  media: [{ type: String }], // URLs for images, videos, docs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkReport', WorkReportSchema);
