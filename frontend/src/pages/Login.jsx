import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, isAdmin } from '../api/session';
import styles from './Login.module.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const user = await login(form.email, form.password);
      // Send people back where they were headed, or to the dashboard their
      // role actually grants them.
      const intended = location.state?.from;
      navigate(intended || (isAdmin(user) ? '/admin' : '/employee'), { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
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
              required
            />
          </div>

          {error && (
            <div className={styles.errorMsg} role="alert">
              {error}
            </div>
          )}

          <button type="submit" className={styles.btnSubmit} disabled={busy}>
            {busy ? <span className={styles.loadingSpinner} /> : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
