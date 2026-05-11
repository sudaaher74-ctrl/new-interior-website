const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

const Admin = mongoose.model('Admin', AdminSchema);

async function setupAdmin() {
    const email = 'admin@osinteriors.com';
    const password = 'os@2024';

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Admin.deleteOne({ email }); // Remove if exists
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();

        console.log(`Admin user created: ${email} / ${password}`);
        process.exit(0);
    } catch (err) {
        console.error('Error setting up admin:', err);
        process.exit(1);
    }
}

setupAdmin();
