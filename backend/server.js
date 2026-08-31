const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com/gsi/client", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com", "https://accounts.google.com/gsi/style"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https://*.basemaps.cartocdn.com", "https://res.cloudinary.com", "https://unpkg.com", "https://lh3.googleusercontent.com", "https://*.googleusercontent.com"],
        connectSrc: ["'self'", "https://api.cloudinary.com", "https://accounts.google.com/gsi/"],
        frameSrc: ["'self'", "https://accounts.google.com/gsi/"],
      },
    },
    crossOriginEmbedderPolicy: false, // Prevents issues with external images/tiles
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve HTML pages locally

// Global API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { msg: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// The login limiter now lives with the login route itself, in routes/auth.js.

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// ── DATABASE CONNECTION ─────────────────────────────────────
let cachedDbPromise = null;
const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables');
    return;
  }
  if (!cachedDbPromise) {
    cachedDbPromise = mongoose.connect(MONGODB_URI).then((m) => {
      console.log('Connected to MongoDB');
      return m;
    }).catch(err => {
      cachedDbPromise = null;
      console.error('MongoDB connection error:', err);
    });
  }
  return cachedDbPromise;
};

if (MONGODB_URI) {
  connectDb();
}

app.use(async (req, res, next) => {
  try {
    await connectDb();
  } catch (err) {
    console.error('DB connect middleware error:', err);
  }
  next();
});
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
