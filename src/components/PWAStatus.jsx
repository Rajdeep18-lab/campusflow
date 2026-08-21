import React, { useState, useEffect } from 'react';
import { RefreshCw, WifiOff, Wifi } from 'lucide-react';

/**
 * PWAUpdater — listens for SW update events safely (no virtual: imports).
 * PWAOfflineIndicator — shows a pill when the user is offline.
 */

export const PWAUpdater = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Listen for SW update found
    const handleSWUpdate = (reg) => {
      if (reg.waiting) {
        setNeedRefresh(true);
        setRegistration(reg);
      }
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            setNeedRefresh(true);
            setRegistration(reg);
          }
        });
      });
    };

    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) handleSWUpdate(reg);
    }).catch(() => {/* silently ignore */});
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  if (!needRefresh) return null;

  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%',
      transform: 'translateX(-50%)', zIndex: 99999,
      background: 'rgba(15,23,42,0.95)',
      border: '1px solid rgba(5,150,105,0.4)',
      borderRadius: 14, padding: '12px 18px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(20px)',
      animation: 'slideDownToast 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      whiteSpace: 'nowrap',
    }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        🎉 New version available!
      </div>
      <button
        onClick={handleUpdate}
        style={{
          height: 32, padding: '0 14px', borderRadius: 8,
          background: 'linear-gradient(135deg, #059669, #0F766E)',
          color: '#fff', fontWeight: 700, fontSize: '0.8125rem',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <RefreshCw size={13} strokeWidth={2.5} /> Update
      </button>
    </div>
  );
};

export const PWAOfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const goOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%',
      transform: 'translateX(-50%)', zIndex: 99998,
      background: isOnline ? 'rgba(5,150,105,0.9)' : 'rgba(220,38,38,0.92)',
      borderRadius: 24, padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      animation: 'slideDownToast 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
      whiteSpace: 'nowrap',
    }}>
      {isOnline
        ? <Wifi size={14} color="#fff" strokeWidth={2.5} />
        : <WifiOff size={14} color="#fff" strokeWidth={2.5} />
      }
      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>
        {isOnline ? 'Back online!' : "You're offline — app still works!"}
      </span>
    </div>
  );
};
