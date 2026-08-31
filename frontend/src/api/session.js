import axios from 'axios';
import { API_BASE_URL } from './config';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
};

export const isAdmin = (user = getUser()) =>
  Boolean(user) && ['Super Admin', 'Owner'].includes(user.role);

/** Authorization header for API calls; empty when signed out. */
export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || 'Could not sign in.');

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function loginWithGoogle(payload) {
  const body = typeof payload === 'string'
    ? { credential: payload }
    : (payload.credential ? { credential: payload.credential } : { access_token: payload.access_token });

  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.error || (res.status === 404 ? 'API route not found on server' : `Sign in failed (HTTP ${res.status})`));

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Tokens expire after 8 hours, so a dashboard left open overnight will start
 * getting 401s. Rather than filling the screen with failed panels, clear the
 * session and send the user to the login page.
 */
export function installAuthInterceptor() {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && window.location.pathname !== '/login') {
        logout();
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Asks the server whether the stored token is still good. The token carries an
 * expiry, so a client-side check alone would keep stale sessions looking valid.
 */
export async function verifySession() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: authHeaders() });
    if (!res.ok) {
      logout();
      return null;
    }
    const { user } = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    // Network failure is not proof of a bad token — keep the session and let
    // the individual API calls surface the problem.
    return getUser();
  }
}
