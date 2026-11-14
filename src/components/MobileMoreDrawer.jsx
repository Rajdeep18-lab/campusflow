import React, { useEffect } from 'react';
import {
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const MobileMoreDrawer = () => {
  const {
    activePage,
    setActivePage,
    isMobileMoreOpen,
    setIsMobileMoreOpen,
    profile,
    preferences,
    updatePreferences,
    toggleTheme,
  } = useApp();

  const { currentUser, logout } = useAuth();

  // Close on ESC key
  useEffect(() => {
    if (!isMobileMoreOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMoreOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMoreOpen, setIsMobileMoreOpen]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobileMoreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMoreOpen]);

  if (!isMobileMoreOpen) return null;

  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Student');
  const initial = (displayName.charAt(0) || 'S').toUpperCase();
  const avatarUrl = profile?.avatarUrl || currentUser?.photoURL;
  const email = currentUser?.email || 'student@campus.edu';
  const isDark = profile?.theme === 'dark';

  const providerId = currentUser?.providerData?.[0]?.providerId || 'password';
  const providerLabel = providerId.includes('google') ? 'Google' : 'Email';

  const navigateTo = (pageId) => {
    setActivePage(pageId);
    setIsMobileMoreOpen(false);
  };

  const handleLogout = async () => {
    setIsMobileMoreOpen(false);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const MENU_SECTIONS = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Spending trends, charts & budget forecasts',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'profile',
      title: 'Profile & Account',
      description: 'Personal details, avatar photo & security',
      icon: User,
      badge: 'Active',
    },
    {
      id: 'settings',
      title: 'Settings & Preferences',
      description: 'Appearance, currency, defaults & data backups',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <div
      className="mobile-only"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="More Navigation Menu"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileMoreOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(18, 17, 15, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'fadeIn 180ms ease-out',
        }}
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '88vh',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          animation: 'sheetSlideUp 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          paddingBottom: 'calc(18px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Grab Handle */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 2,
            background: 'var(--border)',
            margin: '10px auto 4px',
            flexShrink: 0,
          }}
        />

        {/* Sheet Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px 12px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Menu & Navigation
            </span>
          </div>
          <button
            onClick={() => setIsMobileMoreOpen(false)}
            className="btn-icon"
            style={{ width: 32, height: 32 }}
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            overflowY: 'auto',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* User Account Info Card */}
          <div
            onClick={() => navigateTo('profile')}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-card)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              transition: 'background var(--duration-fast)',
            }}
            role="button"
            tabIndex={0}
            title="Open Profile"
          >
            {/* Avatar */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'var(--accent-solid)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
                overflow: 'hidden',
                border: '2px solid var(--border)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initial
              )}
            </div>

            {/* User Meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: 1,
                }}
              >
                {email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 4,
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <ShieldCheck size={11} strokeWidth={2.2} />
                  <span>{providerLabel}</span>
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                  }}
                >
                  UID Scoped
                </span>
              </div>
            </div>

            <ChevronRight size={18} color="var(--text-muted)" />
          </div>

          {/* Navigation Links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '4px 6px',
              }}
            >
              All Sections
            </div>

            {MENU_SECTIONS.map(({ id, title, description, icon: Icon, badge }) => {
              const isActive = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => navigateTo(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-control)',
                    border: `1px solid ${isActive ? 'var(--accent-solid)' : 'var(--border)'}`,
                    background: isActive ? 'var(--accent-subtle)' : 'var(--surface)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  {/* Icon Circle */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: isActive ? 'var(--accent-solid)' : 'var(--surface-2)',
                      color: isActive ? '#FFFFFF' : 'var(--accent-solid)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>

                  {/* Text details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{title}</span>
                      {badge && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                          }}
                        >
                          {badge}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {description}
                    </div>
                  </div>

                  <ChevronRight size={16} color="var(--text-muted)" />
                </button>
              );
            })}
          </div>

          {/* Quick Controls: Appearance & Theme Switcher */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-control)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text)',
                }}
              >
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  Theme Mode
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Currently {isDark ? 'Dark' : 'Light'}
                </div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{
                height: 32,
                padding: '0 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-pill)',
                gap: 6,
              }}
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
              <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 44,
              padding: '0 16px',
              borderRadius: 'var(--radius-control)',
              background: 'transparent',
              border: '1px solid rgba(180, 35, 24, 0.35)',
              color: 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
              transition: 'background var(--duration-fast)',
            }}
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
