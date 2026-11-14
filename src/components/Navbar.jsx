import React from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const {
    profile,
    toggleTheme,
    setIsGlobalSearchOpen,
    setActivePage,
  } = useApp();

  const { currentUser } = useAuth();
  const isDark = profile?.theme === 'dark';
  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Rajdeep');
  const initial = (displayName.charAt(0) || 'R').toUpperCase();

  return (
    <header className="app-navbar">
      {/* Mobile brand (<= 768px) */}
      <div
        className="flex items-center gap-2 md:hidden cursor-pointer"
        onClick={() => setActivePage('dashboard')}
      >
        <div className="sidebar-logo-icon" style={{ width: 26, height: 26, fontSize: 13 }}>
          C
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
          CampusFlow
        </span>
      </div>

      {/* Desktop Search Button (>= 768px) */}
      <button
        onClick={() => setIsGlobalSearchOpen(true)}
        className="nav-search-btn hidden md:flex"
        title="Search expenses, tasks (Ctrl+K)"
      >
        <Search size={14} color="var(--text-muted)" strokeWidth={1.75} />
        <span>Search</span>
        <span className="kbd-badge">Ctrl K</span>
      </button>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="btn-icon md:hidden"
          title="Search"
          aria-label="Search"
        >
          <Search size={18} strokeWidth={1.75} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={15} strokeWidth={1.75} />
          ) : (
            <Moon size={15} strokeWidth={1.75} />
          )}
        </button>

        {/* Mobile Avatar (<= 768px) - Clicking navigates to Settings */}
        <div
          className="sidebar-avatar-circle md:hidden"
          onClick={() => setActivePage('settings')}
          style={{ cursor: 'pointer' }}
          title="Settings"
          role="button"
          tabIndex={0}
        >
          {initial}
        </div>
      </div>
    </header>
  );
};
