import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, isAdmin, verifySession } from '../api/session';

/**
 * Gate for the dashboard routes.
 *
 * A token in localStorage is only a hint — it may be expired or forged — so it
 * is checked against /api/auth/me before the dashboard renders. The server
 * enforces this independently on every request; this guard exists so people
 * see a login screen instead of a broken dashboard full of 401s.
 */
const RequireAuth = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const [state, setState] = useState(() => (getToken() ? 'checking' : 'denied'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (state !== 'checking') return undefined;

    let active = true;
    verifySession().then((verified) => {
      if (!active) return;
      setUser(verified);
      setState(verified ? 'allowed' : 'denied');
    });

    return () => {
      active = false;
    };
  }, [state]);

  if (state === 'checking') {
    return <div style={{ padding: '48px' }}>Checking your session…</div>;
  }

  if (state === 'denied') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/employee" replace />;
  }

  return children;
};

export default RequireAuth;
