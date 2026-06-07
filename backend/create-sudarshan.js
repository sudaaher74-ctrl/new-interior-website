const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');

dotenv.config();

async function createSudarshan() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'sudarshan@osinterior.com' });
    if (user) {
      console.log('User Sudarshan already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('sudarshan123', salt);

    // Get a project to assign
    const project = await Project.findOne();

    user = new User({
      employeeId: 'EMP003',
      fullName: 'Sudarshan Aher',
      email: 'sudarshan@osinterior.com',
      password: password,
      mobileNumber: '7777777777',
      role: 'Employee',
      designation: 'Site Engineer',
      department: 'Operations',
      assignedSites: project ? [project._id] : []
    });

    await user.save();
    console.log('User created: sudarshan@osinterior.com / sudarshan123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createSudarshan();
