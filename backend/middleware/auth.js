const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'os_interiors_secret_key_2024';

const JWT_ISSUER = 'os-interiors-api';

const ADMIN_ROLES = ['Super Admin', 'Owner'];

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
    if (!decoded.user || !decoded.user.role) {
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
 * Pass roles as strings. e.g., authorizeRoles('Super Admin', 'Project Manager')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // We assume `auth` middleware has already run and attached `req.user`.
    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { auth, authorizeRoles, ADMIN_ROLES, JWT_SECRET, JWT_ISSUER };
