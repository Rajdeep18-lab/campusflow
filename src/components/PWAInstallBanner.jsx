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
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if user already dismissed
    if (localStorage.getItem('pwa-install-dismissed') === 'true') return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShow(false);
    }

    window.addEventListener('appinstalled', () => {
      setShow(false);
      setInstalled(true);
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
        bottom: 80, // above bottom nav
        left: 12,
        right: 12,
        zIndex: 9999,
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(5,150,105,0.18) 0%, rgba(15,118,110,0.18) 100%)',
        border: '1px solid rgba(5,150,105,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(5,150,105,0.1)',
        animation: 'slideUpBanner 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #059669, #0F766E)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(5,150,105,0.4)',
      }}>
        <Smartphone size={22} color="#fff" strokeWidth={2} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Install CampusFlow
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>
          Add to Home Screen for a faster, native-like experience
        </div>
      </div>

      {/* Install button */}
      <button
        onClick={handleInstall}
        disabled={installing}
        style={{
          flexShrink: 0,
          height: 36,
          padding: '0 14px',
          borderRadius: 10,
          background: 'linear-gradient(135deg, #059669, #0F766E)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.8125rem',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
          opacity: installing ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        <Download size={14} strokeWidth={2.5} />
        {installing ? 'Installing…' : 'Install'}
      </button>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Dismiss install prompt"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default PWAInstallBanner;
