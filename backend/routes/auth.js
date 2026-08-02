const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { auth, JWT_SECRET } = require('../middleware/auth');

const TOKEN_TTL = '8h';

// Brute-force guard on the only endpoint that accepts a password.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { msg: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login — exchange credentials for a JWT.
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    // Same response whether the address is unknown or the password is wrong,
    // so the endpoint can't be used to enumerate accounts.
    const invalid = { msg: 'Invalid credentials' };
    if (!user) return res.status(401).json(invalid);

    const matches = await bcrypt.compare(String(password), user.password);
    if (!matches) return res.status(401).json(invalid);

    const payload = { user: { id: user.id, role: user.role, fullName: user.fullName } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });

    res.json({ token, user: payload.user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/auth/me — lets the client confirm a stored token is still valid.
router.get('/me', auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
