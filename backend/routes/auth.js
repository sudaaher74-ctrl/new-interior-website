const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { auth, JWT_SECRET, JWT_ISSUER } = require('../middleware/auth');

const TOKEN_TTL = '8h';
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '899995534575-m3pj4a35ud3rcrvvee62bed64sh678jt.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Brute-force guard on endpoints that accept credentials.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { msg: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
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

    if (!user.password) {
      return res.status(401).json({ msg: 'This account uses Google Sign-In. Please sign in with Google.' });
    }

    const matches = await bcrypt.compare(String(password), user.password);
    if (!matches) return res.status(401).json(invalid);

    const payload = { 
      user: { 
        id: user.id, 
        role: user.role, 
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto 
      } 
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL, issuer: JWT_ISSUER });

    res.json({ token, user: payload.user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/auth/google — exchange verified Google ID token or access token for an app JWT.
router.post('/google', loginLimiter, async (req, res) => {
  try {
    const { credential, access_token } = req.body;
    if (!credential && !access_token) {
      return res.status(400).json({ msg: 'Google token is required' });
    }

    const clientId = GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is not configured.');
      return res.status(500).json({ msg: 'Google Authentication is not configured on the server.' });
    }

    let email, googleId, fullName, profilePhoto;

    if (credential) {
      // Verify ID token using google-auth-library
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: clientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          return res.status(401).json({ msg: 'Could not obtain email from Google account' });
        }
        email = payload.email.toLowerCase().trim();
        googleId = payload.sub;
        fullName = payload.name || email.split('@')[0];
        profilePhoto = payload.picture || '';
      } catch (verifyErr) {
        console.error('Google ID token verification failed:', verifyErr.message);
        return res.status(401).json({ msg: 'Invalid or expired Google token' });
      }
    } else if (access_token) {
      // Fetch user profile from Google userinfo API
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!userInfoRes.ok) {
          return res.status(401).json({ msg: 'Failed to verify Google access token' });
        }
        const data = await userInfoRes.json();
        if (!data.email) {
          return res.status(401).json({ msg: 'Could not obtain email from Google account' });
        }
        email = data.email.toLowerCase().trim();
        googleId = data.sub;
        fullName = data.name || email.split('@')[0];
        profilePhoto = data.picture || '';
      } catch (tokenErr) {
        console.error('Google userinfo fetch failed:', tokenErr.message);
        return res.status(401).json({ msg: 'Error verifying Google session' });
      }
    }

    // Find existing user by email or googleId
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (user) {
      // Link googleId and profilePhoto if missing
      let modified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (!user.profilePhoto && profilePhoto) {
        user.profilePhoto = profilePhoto;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    } else {
      // Create new user with default 'Employee' role
      const count = await User.countDocuments();
      let employeeId = 'EMP' + (count + 1).toString().padStart(3, '0');
      let existingEmp = await User.findOne({ employeeId });
      if (existingEmp) {
        employeeId = 'EMP' + Date.now().toString().slice(-4);
      }

      user = new User({
        employeeId,
        fullName,
        email,
        googleId,
        authProvider: 'google',
        role: 'Employee',
        profilePhoto,
        designation: 'Site Engineer'
      });

      await user.save();
    }

    const payload = { 
      user: { 
        id: user.id, 
        role: user.role, 
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto 
      } 
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL, issuer: JWT_ISSUER });

    res.json({ token, user: payload.user });
  } catch (err) {
    console.error('Google auth server error:', err);
    res.status(500).json({ msg: err.message || 'Server error during Google authentication' });
  }
});

// GET /api/auth/me — lets the client confirm a stored token is still valid.
router.get('/me', auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
