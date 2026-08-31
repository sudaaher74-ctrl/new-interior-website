import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { login, loginWithGoogle, isAdmin } from '../api/session';
import styles from './Login.module.css';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '899995534575-m3pj4a35ud3rcrvvee62bed64sh678jt.apps.googleusercontent.com';

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
        </div>
      </div>
    </div>
  );
};

export default Login;
