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
      fullName: 'OS Interior Super Admin',
      email: 'admin@osinterior.com',
      password: adminPassword,
      mobileNumber: '9999999999',
      role: 'Super Admin',
      designation: 'Managing Director',
      department: 'Management'
    });
    await admin.save();
    console.log('Super Admin created: admin@osinterior.com / admin123');

    // Create Portfolio Projects (for the main website and admin dashboard)
    const portfolioProjects = [
      { title: 'Lakhani Centrium', category: 'Commercial', budget: '₹1.2 Cr', location: 'Navi Mumbai', description: 'A state-of-the-art commercial workspace focusing on ergonomic design, natural lighting, and modern collaboration zones.', cover: 'images/juice1.jpeg', status: 'Ongoing' },
      { title: 'The Bombay Canteen', category: 'Hospitality', budget: '₹85 L', location: 'Lower Parel', description: 'A vibrant cafe and restaurant capturing the essence of old Bombay with a modern, chic twist.', cover: 'images/bombayB1.jpeg', status: 'Completed' },
      { title: 'Caravan Oasis', category: 'Hospitality', budget: '₹60 L', location: 'Bandra West', description: 'A cozy, nature-inspired cafe retreat featuring abundant indoor plants and warm wooden textures.', cover: 'images/caravab1.jpeg', status: 'Ongoing' },
      { title: 'Belapur Corporate', category: 'Commercial', budget: '₹2.5 Cr', location: 'Belapur', description: 'A high-end corporate office spanning 15,000 sq ft, designed for productivity and executive elegance.', cover: 'images/BelapurC3.jpeg', status: 'Upcoming' },
      { title: 'Kandivali Heights', category: 'Residential', budget: '₹45 L', location: 'Kandivali East', description: 'A luxurious 3BHK residential project featuring modern minimalist interiors and smart home integration.', cover: 'images/Kandivali!.jpeg', status: 'Completed' },
      { title: 'Urban Brew Cafe', category: 'Hospitality', budget: '₹35 L', location: 'Andheri West', description: 'A trendy, industrial-style coffee shop designed to attract young professionals and creatives.', cover: 'images/caffe.jpeg', status: 'Ongoing' }
    ];

    // Note: The ERP Project model requires 'name' instead of 'title'
    let seededProject = null;
    for (const p of portfolioProjects) {
      const project = new Project({
        name: p.title,
        clientName: 'Unknown',
        siteAddress: p.location,
        status: p.status,
        coordinates: null, // No radius check
        
        // Custom fields for portfolio (will be saved in MongoDB if schema has strict: false, or we need to update schema)
        title: p.title,
        category: p.category,
        budget: p.budget,
        location: p.location,
        description: p.description,
        cover: p.cover
      });
      await project.save();
      if (!seededProject) seededProject = project;
      console.log('Project created: ' + project.name);
    }
    const employee = new User({
      employeeId: 'EMP002',
      fullName: 'Jane Smith',
      email: 'employee@osinterior.com',
      password: employeePassword,
      mobileNumber: '8888888888',
      role: 'Employee',
      designation: 'Site Supervisor',
      department: 'Operations',
      assignedSites: [seededProject._id]
    });
    await employee.save();
    console.log('Employee created: employee@osinterior.com / employee123 (Assigned to project)');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
