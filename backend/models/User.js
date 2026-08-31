const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return this.authProvider !== 'google' && !this.googleId; } 
  },
  mobileNumber: { 
    type: String, 
    required: false 
  },
  designation: { type: String },
  department: { type: String },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Owner', 'Project Manager', 'Site Supervisor', 'Employee'], 
    default: 'Employee' 
  },
  googleId: { type: String, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  assignedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ErpProject' }],
  profilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
