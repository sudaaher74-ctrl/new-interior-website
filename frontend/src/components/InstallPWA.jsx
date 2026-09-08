import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken } from '../api/session';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('os_portal_install_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();

  useEffect(() => {
    // Check if already installed or running in standalone PWA mode
    const inStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (inStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);
    if (isIosDevice && isSafari && !inStandalone) {
      setIsIOS(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async (evt) => {
    evt.preventDefault();
    if (!promptInstall) return;

    try {
      await promptInstall.prompt();
      const choiceResult = await promptInstall.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setSupportsPWA(false);
        setIsInstalled(true);
      }
    } catch {
      // Ignored
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('os_portal_install_dismissed', 'true');
    } catch {
      // Ignored
    }
  };

  // Only show the install prompt on internal portal routes or when signed in
  const isPortalRoute =
    location.pathname.startsWith('/employee') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login');

  const hasAuth = Boolean(getToken());

  if (isInstalled || dismissed || (!isPortalRoute && !hasAuth)) {
    return null;
  }

  // Android / Chromium native install banner
  if (supportsPWA && promptInstall) {
    return (
      <div
        role="region"
        aria-label="Install OS Portal App"
        style={{
          position: 'fixed',
          bottom: 'calc(85px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 9999,
          width: 'max-content',
          maxWidth: '92vw',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexShrink: 0,
          }}
        >
          📱
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
          <span style={{ fontWeight: '700', fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
            Install OS Portal
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Add Employee Dashboard to Home Screen
          </span>
        </div>
        <button
          type="button"
          onClick={handleInstallClick}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '0.82rem',
            cursor: 'pointer',
            marginLeft: '4px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
        >
          Add to Home Screen
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: '1',
          }}
        >
          ×
        </button>
      </div>
    );
  }

  // iOS Safari instructions banner
  if (isIOS) {
    return (
      <div
        role="region"
        aria-label="Add OS Portal to Home Screen"
        style={{
          position: 'fixed',
          bottom: 'calc(85px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 9999,
          width: 'max-content',
          maxWidth: '92vw',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>📲</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>
            Add OS Portal to Home Screen
          </span>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
            Tap <strong style={{ color: '#60a5fa' }}>Share ⎋</strong> then select{' '}
            <strong style={{ color: '#60a5fa' }}>"Add to Home Screen"</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install instructions"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: '1',
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return null;
};

export default InstallPWA;
