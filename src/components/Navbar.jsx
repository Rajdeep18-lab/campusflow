import React from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';

export const Navbar = () => {
  const {
    activePage,
    profile,
    toggleTheme,
    setIsGlobalSearchOpen,
    setActivePage,
  } = useApp();

  const { currentUser } = useAuth();

  const pageTitles = {
    dashboard: 'Dashboard',
    expenses: 'Expense Manager',
    todos: 'Task Manager',
    analytics: 'Analytics & Insights',
    calendar: 'Calendar View',
    settings: 'Settings',
  };

  return (
    <header className="app-navbar">
      {/* Left: Mobile brand | Desktop active page breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {/* Mobile logo */}
        <div
          className="md:hidden"
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => setActivePage('dashboard')}
        >
          <div style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #E8A33D, #d9922c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h10a6 6 0 0 1 0 12H4" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12h7" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            CampusFlow
          </span>
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            CampusFlow
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/</span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}>
            {pageTitles[activePage] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Search trigger */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 36,
            padding: '0 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-base)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 400,
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            maxWidth: 240,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-accent)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-base)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          title="Search (Ctrl+K)"
        >
          <Search size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span style={{ display: 'none' }} className="sm:inline">Search...</span>
          <kbd style={{
            display: 'none',
            padding: '2px 5px',
            borderRadius: 4,
            background: 'var(--bg-base)',
            border: '1px solid var(--border-base)',
            fontSize: '0.625rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }} className="lg:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${profile?.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {profile?.theme === 'dark'
            ? <Sun size={16} color="#E8A33D" strokeWidth={2} />
            : <Moon size={16} color="var(--accent)" strokeWidth={2} />
          }
        </button>

        {/* Avatar → Settings */}
        <button
          onClick={() => setActivePage('settings')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            borderRadius: 'var(--radius-full)',
            transition: 'opacity 0.15s',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          title={currentUser?.email ? `Signed in as ${currentUser.email} · Settings` : 'Profile & Settings'}
        >
          <UserAvatar size="sm" />
        </button>
      </div>
    </header>
  );
};
