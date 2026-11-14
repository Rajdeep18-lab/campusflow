import React, { useState, useEffect } from 'react';
import { RefreshCw, WifiOff, Wifi } from 'lucide-react';

/**
 * PWAUpdater — listens for SW update events safely.
 * PWAOfflineIndicator — shows a pill when the user is offline.
 */

export const PWAUpdater = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

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
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      whiteSpace: 'nowrap',
    }}>
      <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        A new version of CampusFlow is available
      </div>
      <button
        onClick={handleUpdate}
        className="btn btn-primary"
        style={{
          height: 30,
          padding: '0 12px',
          borderRadius: 'var(--radius-control)',
          background: 'var(--accent)',
          color: '#FFFFFF',
          fontWeight: 500,
          fontSize: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <RefreshCw size={12} />
        Update
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
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99998,
      background: isOnline ? 'var(--accent)' : 'var(--danger)',
      color: '#FFFFFF',
      borderRadius: 9999,
      padding: '6px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '0.75rem',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {isOnline
        ? <Wifi size={13} color="#fff" />
        : <WifiOff size={13} color="#fff" />
      }
      <span>{isOnline ? 'Back online' : 'Offline mode — local data active'}</span>
    </div>
  );
};
