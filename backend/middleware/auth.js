const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'os_interiors_secret_key_2024';

const JWT_ISSUER = 'os-interiors-api';

const ADMIN_ROLES = ['Super Admin', 'Owner', 'Admin'];

function readToken(req) {
  const header = req.header('Authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

/**
 * Verifies the JWT and attaches the caller to req.user.
 *
 * Tokens are signed as { user: { id, role, fullName } } — see routes/auth.js.
 */
const auth = (req, res, next) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
    if (!decoded.user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};

/** 
 * Granular Role-Based Access Control (RBAC) middleware.
 * Checks JWT role first, and falls back to live Supabase database record
 * so newly promoted Super Admins never get locked out by stale tokens.
 */
const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    
    // 1. Fast check if JWT role matches
    if (req.user.role && allowedRoles.includes(req.user.role)) {
      return next();
    }

    // 2. Fallback check to live Supabase database
    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .maybeSingle();

      if (dbUser && allowedRoles.includes(dbUser.role)) {
        req.user.role = dbUser.role;
        return next();
      }
    } catch (e) {
      console.error('RBAC live role lookup error:', e);
    }

    return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
  };
};

module.exports = { auth, authorizeRoles, ADMIN_ROLES, JWT_SECRET, JWT_ISSUER };
