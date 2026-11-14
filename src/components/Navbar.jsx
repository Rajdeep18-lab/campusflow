import React from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const {
    profile,
    toggleTheme,
    setIsGlobalSearchOpen,
    activePage,
    setActivePage,
  } = useApp();

  const { currentUser } = useAuth();
  const isDark = profile?.theme === 'dark';
  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Rajdeep');
  const initial = (displayName.charAt(0) || 'R').toUpperCase();
  const avatarUrl = profile?.avatarUrl || currentUser?.photoURL;
  const isProfileActive = activePage === 'profile';

  return (
    <header className="app-navbar">
      {/* Mobile brand (<= 768px) */}
      <div
        className="mobile-only-flex items-center gap-2 cursor-pointer"
        onClick={() => setActivePage('dashboard')}
        style={{ minWidth: 0, flexShrink: 0 }}
      >
        <div className="sidebar-logo-icon" style={{ width: 26, height: 26, fontSize: 13, flexShrink: 0 }}>
          C
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
          CampusFlow
        </span>
      </div>

      {/* Desktop Search Button (>= 768px) */}
      <button
        onClick={() => setIsGlobalSearchOpen(true)}
        className="nav-search-btn desktop-only"
        title="Search expenses, tasks (Ctrl+K)"
      >
        <Search size={14} color="var(--text-secondary)" strokeWidth={1.75} />
        <span>Search</span>
        <span className="kbd-badge">Ctrl K</span>
      </button>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="btn-icon mobile-only-flex"
          title="Search"
          aria-label="Search"
          style={{ width: 34, height: 34 }}
        >
          <Search size={17} strokeWidth={1.75} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
          style={{ width: 34, height: 34 }}
        >
          {isDark ? (
            <Sun size={15} strokeWidth={1.75} />
          ) : (
            <Moon size={15} strokeWidth={1.75} />
          )}
        </button>

        {/* Mobile Avatar (<= 768px) - Clicking navigates to Profile */}
        <button
          type="button"
          onClick={() => setActivePage('profile')}
          className="mobile-only-flex"
          title="Profile & Account Settings"
          aria-label="Profile and account settings"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            touchAction: 'manipulation',
          }}
        >
          <div
            className="sidebar-avatar-circle"
            style={{
              width: 32,
              height: 32,
              fontSize: 13,
              overflow: 'hidden',
              boxSizing: 'border-box',
              outline: isProfileActive ? '2px solid var(--accent)' : 'none',
              outlineOffset: 1,
              border: isProfileActive ? '1px solid var(--accent)' : '1px solid var(--border)',
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initial
            )}
          </div>
        </button>
      </div>
    </header>
  );
};
