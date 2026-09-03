const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const supabase = require('../config/supabase');
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

// Helper to normalize user payload
function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role || 'Employee',
    fullName: row.full_name || row.fullName || 'Employee',
    email: row.email,
    mobileNumber: row.mobile_number || row.mobileNumber || '',
    googleId: row.google_id || row.googleId || '',
    profilePhoto: row.profile_photo || row.profilePhoto || '',
    employeeId: row.employee_id || row.employeeId || '',
    authProvider: row.auth_provider || 'local',
    createdAt: row.created_at || '',
  };
}

// POST /api/auth/login — exchange credentials for a JWT.
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.error('Supabase user fetch error:', error);
      return res.status(500).json({ msg: 'Database query error: ' + error.message });
    }

    const invalid = { msg: 'Invalid credentials' };
    if (!user) return res.status(401).json(invalid);

    // Block deactivated accounts
    if (user.is_active === false) {
      return res.status(403).json({ msg: 'Your account has been deactivated. Please contact your admin.' });
    }

    if (!user.password) {
      return res.status(401).json({ msg: 'This account uses Google Sign-In. Please sign in with Google.' });
    }

    const matches = await bcrypt.compare(String(password), user.password);
    if (!matches) return res.status(401).json(invalid);

    const userPayload = formatUser(user);
    const payload = { user: userPayload };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL, issuer: JWT_ISSUER });

    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Login error:', err);
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

    // Find existing user by google_id or email
    let existingUser = null;
    if (googleId) {
      const { data: byGoogle } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleId)
        .maybeSingle();
      if (byGoogle) existingUser = byGoogle;
    }

    if (!existingUser && email) {
      const { data: byEmail } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (byEmail) existingUser = byEmail;
    }

    const ADMIN_GOOGLE_EMAIL = 'team.osinteriors@gmail.com';

    let userRow;

    if (existingUser) {
      // Check if account is active
      if (existingUser.is_active === false) {
        return res.status(403).json({ msg: 'Your account has been deactivated. Please contact your admin.' });
      }

      // ✋ Strict Access Control: ONLY team.osinteriors@gmail.com can hold Admin/Super Admin privileges via Google
      let finalRole = existingUser.role;
      if (email === ADMIN_GOOGLE_EMAIL) {
        finalRole = 'Super Admin';
      } else if (['Super Admin', 'Owner', 'Admin'].includes(finalRole)) {
        console.warn(`Blocked non-authorized Google admin access attempt from ${email}`);
        return res.status(403).json({
          msg: 'Admin portal access via Google is exclusively restricted to team.osinteriors@gmail.com.',
        });
      }

      const updates = {};
      if (!existingUser.google_id && googleId) updates.google_id = googleId;
      if (!existingUser.profile_photo && profilePhoto) updates.profile_photo = profilePhoto;
      if (existingUser.role !== finalRole) updates.role = finalRole;

      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('users')
          .update(updates)
          .eq('id', existingUser.id)
          .select()
          .single();
        userRow = updated || existingUser;
      } else {
        userRow = existingUser;
      }
    } else {
      // Auto-provision team.osinteriors@gmail.com as Super Admin if not already present
      if (email === ADMIN_GOOGLE_EMAIL) {
        const { data: newAdmin, error: createErr } = await supabase
          .from('users')
          .insert({
            email: ADMIN_GOOGLE_EMAIL,
            full_name: fullName || 'OS Interiors Admin',
            role: 'Super Admin',
            google_id: googleId,
            profile_photo: profilePhoto,
            auth_provider: 'google',
            employee_id: 'ADM-001',
            is_active: true
          })
          .select()
          .single();

        if (createErr) throw createErr;
        userRow = newAdmin;
      } else {
        // ✋ SECURITY: Do NOT auto-create accounts.
        // Only employees pre-registered by the admin can log in.
        console.warn(`Blocked unknown Google login attempt: ${email}`);
        return res.status(403).json({
          msg: 'Access denied. Your Google account is not registered as an OS Interiors employee. Please contact your admin.',
        });
      }
    }


    const userPayload = formatUser(userRow);
    const payload = { user: userPayload };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL, issuer: JWT_ISSUER });

    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Google auth server error:', err);
    res.status(500).json({ msg: err.message || 'Server error during Google authentication' });
  }
});

// GET /api/auth/me — lets the client confirm a stored token is still valid and fetch latest live role.
router.get('/me', auth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (user) {
      return res.json({ user: formatUser(user) });
    }
    res.json({ user: req.user });
  } catch {
    res.json({ user: req.user });
  }
});

// GET /api/auth/profile — fetch full employee profile
router.get('/profile', auth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ msg: 'User profile not found' });
    }

    res.json({ user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/auth/profile — update mobile number or name
router.put('/profile', auth, async (req, res) => {
  try {
    const { mobileNumber, fullName } = req.body;
    const updates = {};
    if (mobileNumber !== undefined) updates.mobile_number = mobileNumber;
    if (fullName !== undefined) updates.full_name = fullName;

    const { data: updated, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ msg: 'Profile updated successfully', user: formatUser(updated) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ msg: 'Failed to update profile' });
  }
});

module.exports = router;
