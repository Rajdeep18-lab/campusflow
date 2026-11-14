import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * PWAInstallBanner
 * Shows a bottom banner on mobile when the app can be installed as a PWA.
 * Disappears if user dismisses (stored in localStorage) or installs.
 */
export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa-install-dismissed') === 'true') return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShow(false);
    }

    window.addEventListener('appinstalled', () => {
      setShow(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 74,
        left: 12,
        right: 12,
        zIndex: 9999,
        borderRadius: 'var(--radius-card)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-control)',
        flexShrink: 0,
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
      }}>
        <Smartphone size={18} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Install CampusFlow
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          Add to home screen for faster offline access
        </div>
      </div>

      <button
        onClick={handleInstall}
        disabled={installing}
        className="btn btn-primary"
        style={{
          flexShrink: 0,
          height: 32,
          padding: '0 12px',
          borderRadius: 'var(--radius-control)',
          background: 'var(--accent)',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Download size={13} />
        {installing ? 'Installing...' : 'Install'}
      </button>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          width: 24,
          height: 24,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
};
