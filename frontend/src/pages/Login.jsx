import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { login, loginWithGoogle, isAdmin } from '../api/session';
import styles from './Login.module.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GoogleIcon = () => (
  <svg className={styles.googleIcon} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const handleSuccessfulAuth = (user) => {
    // Send people back where they were headed, or to the dashboard their role grants them
    const intended = location.state?.from;
    navigate(intended || (isAdmin(user) ? '/admin' : '/employee'), { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const user = await login(form.email, form.password);
      handleSuccessfulAuth(user);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Google Sign-In failed: missing credential.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      handleSuccessfulAuth(user);
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
      setBusy(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or encountered an issue. Please try again.');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow} />
      <div className={`${styles.ambientGlow} ${styles.ambientGlow2}`} />

      <div className={styles.glassContainer}>
        <div className={styles.logoContainer}>
          <h1>OS Interiors</h1>
          <p>Sign in to continue</p>
        </div>

        {error && (
          <div className={styles.errorMsg} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className={styles.inputField}
              value={form.email}
              onChange={update('email')}
              disabled={busy}
              placeholder="name@osinteriors.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={styles.inputField}
              value={form.password}
              onChange={update('password')}
              disabled={busy}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={busy}>
            {busy ? <span className={styles.loadingSpinner} /> : 'Sign in with Password'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.googleContainer}>
          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className={styles.googleBtnWrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="continue_with"
                  useOneTap={false}
                />
              </div>
            </GoogleOAuthProvider>
          ) : (
            <div style={{ width: '100%' }}>
              <button
                type="button"
                className={styles.googlePlaceholderBtn}
                onClick={() => setError('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your frontend .env file.')}
                disabled={busy}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
              <div className={styles.configNotice}>
                Configure <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code> to activate
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
