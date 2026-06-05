const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  designation: { type: String },
  department: { type: String },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Owner', 'Project Manager', 'Site Supervisor', 'Employee'], 
    default: 'Employee' 
  },
  assignedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ErpProject' }],
  profilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
