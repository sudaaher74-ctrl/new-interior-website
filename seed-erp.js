const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Attendance = require('./models/Attendance');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean up
    await User.deleteMany({});
    await Project.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleaned up existing ERP data');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const employeePassword = await bcrypt.hash('employee123', salt);

    // Create Admin
    const admin = new User({
      employeeId: 'EMP001',
      fullName: 'AIVA Super Admin',
      email: 'admin@aiva.com',
      password: adminPassword,
      mobileNumber: '9999999999',
      role: 'Super Admin',
      designation: 'Managing Director',
      department: 'Management'
    });
    await admin.save();
    console.log('Super Admin created: admin@aiva.com / admin123');

    // Create Project
    const project = new Project({
      name: 'Downtown Renovation Project',
      clientName: 'John Doe',
      siteAddress: '123 Main St, Metro City',
      status: 'Ongoing',
      coordinates: null // Null coordinates skips radius check for easy demo testing
    });
    await project.save();
    console.log('Project created: ' + project.name);

    // Create Employee
    const employee = new User({
      employeeId: 'EMP002',
      fullName: 'Jane Smith',
      email: 'employee@aiva.com',
      password: employeePassword,
      mobileNumber: '8888888888',
      role: 'Employee',
      designation: 'Site Supervisor',
      department: 'Operations',
      assignedSites: [project._id]
    });
    await employee.save();
    console.log('Employee created: employee@aiva.com / employee123 (Assigned to project)');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
