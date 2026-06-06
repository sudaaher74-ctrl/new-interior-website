const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.use(helmet({
    contentSecurityPolicy: false // Allow external CDNs (Leaflet, Google Fonts)
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve HTML pages locally

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 login attempts per windowMs
    message: { msg: 'Too many login attempts, please try again later' }
});

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ── DATABASE CONNECTION ─────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ── MODELS ──────────────────────────────────────────────────
const LeadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  projectType: String,
  message: String,
  status: { type: String, default: 'new' },
  priority: { type: String, default: 'none' },
  source: { type: String, default: 'Website Form' },
  notes: [{
    text: String,
    date: { type: Date, default: Date.now },
    system: Boolean
  }],
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  category: String,
  location: String,
  budget: String,
  area: String,
  description: String,
  views: { type: Number, default: 0 },
  date: String,
  cover: String,
  tags: [String],
  gallery: [String],
  beforeImg: String,
  afterImg: String,
  testimonial: {
    name: String,
    role: String,
    text: String
  }
});

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

const Lead = mongoose.model('Lead', LeadSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Admin = mongoose.model('Admin', AdminSchema);

// ── AUTH MIDDLEWARE ─────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// ── ROUTES ──────────────────────────────────────────────────

// ERP API Routes (v2)
app.use('/api/v2/auth', require('./routes/auth'));
app.use('/api/v2/attendance', require('./routes/attendance'));
app.use('/api/v2/projects', require('./routes/projects'));
app.use('/api/v2/admin', require('./routes/admin'));
app.use('/api/v2/reports', require('./routes/reports'));

// 1. Auth Routes
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Setup Initial Admin (One-time use or utility)
app.post('/api/auth/setup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.json({ msg: 'Admin created' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// 2. Lead Routes
app.get('/api/leads', auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.json(savedLead);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.put('/api/leads/:id', auth, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLead);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.delete('/api/leads/:id', auth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Lead deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// 3. Project Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/projects', auth, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Something went wrong on the server' });
});

// ── START SERVER ────────────────────────────────────────────
// Only start the server if we're running locally (not as a Vercel function)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;
