import React, { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setSupportsPWA(false);
      }
    });
  };

  if (!supportsPWA || isInstalled) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0f172a',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 9999,
      width: 'max-content',
      maxWidth: '90vw'
    }}>
      <span style={{ fontSize: '1.2rem' }}>📱</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Install OS Portal</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Add to home screen</span>
      </div>
      <button 
        onClick={onClick}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginLeft: '8px'
        }}
      >
        Install
      </button>
      <button 
        onClick={() => setSupportsPWA(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          fontSize: '1.2rem',
          cursor: 'pointer',
          padding: '0 4px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default InstallPWA;
