const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const helmet = require('helmet');

dotenv.config();

const app = express();
app.use(helmet({
    contentSecurityPolicy: false // Allow external CDNs (Leaflet, Google Fonts)
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve HTML pages locally

// The login limiter now lives with the login route itself, in routes/auth.js.

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// ── DATABASE CONNECTION ─────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models are loaded dynamically where needed via require('../models/...')

// ── ROUTES ──────────────────────────────────────────────────

// 0. Authentication — the only route that issues tokens.
app.use('/api/auth', require('./routes/auth'));

// 1. New Moduler ERP APIs (v2)
app.use('/api/v2/projects', require('./routes/projects'));
app.use('/api/v2/leads', require('./routes/leads'));
app.use('/api/v2/attendance', require('./routes/attendance'));
app.use('/api/v2/reports', require('./routes/reports'));
app.use('/api/v2/admin', require('./routes/admin'));
app.use('/api/v2/site-visits', require('./routes/siteVisits'));
// Use the v2 projects router for /api/projects as well.
app.use('/api/projects', require('./routes/projects'));

// 2. Main Site APIs
app.use('/api/leads', require('./routes/leads'));
// Use the v2 projects router for /api/projects as well.
app.use('/api/projects', require('./routes/projects'));



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
