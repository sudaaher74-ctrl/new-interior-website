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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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

// Models are loaded dynamically where needed via require('../models/...')

// ── AUTH MIDDLEWARE ─────────────────────────────────────────
// Legacy inline auth removed. Using modular routes.

// ── ROUTES ──────────────────────────────────────────────────

// 1. New Moduler ERP APIs (v2)
app.use('/api/v2/auth', require('./routes/auth'));
app.use('/api/v2/attendance', require('./routes/attendance'));
app.use('/api/v2/projects', require('./routes/projects'));
app.use('/api/v2/admin', require('./routes/admin'));
app.use('/api/v2/reports', require('./routes/reports'));

// 2. Main Site APIs
app.use('/api/leads', require('./routes/leads'));
// Use v2 projects router for /api/projects as well so it uses the same bypass logic
app.use('/api/projects', require('./routes/projects'));

// 1. Auth Routes
// Replaced by modular auth logic inside v2/auth
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  res.status(400).json({ msg: 'Please use /api/v2/auth/login' });
});

// Legacy inline routes for leads and projects have been replaced by modular ones.

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
