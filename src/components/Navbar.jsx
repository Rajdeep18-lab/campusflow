import React from 'react';
import { Search, Sun, Moon, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';

export const Navbar = () => {
  const {
    getGreeting,
    profile,
    toggleTheme,
    setIsGlobalSearchOpen,
    setActivePage,
  } = useApp();

  return (
    <header className="app-navbar">
      {/* Left: Mobile brand | Desktop greeting */}
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
            <GraduationCap size={18} color="#0F172A" strokeWidth={2} />
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

        {/* Desktop greeting */}
        <div className="hidden md:block" style={{ minWidth: 0 }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {getGreeting()}
          </h1>
          <p style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
            marginTop: 2,
            whiteSpace: 'nowrap',
          }}>
            Student Expense &amp; Task Control Center
          </p>
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
          title="Profile & Settings"
        >
          <UserAvatar size="sm" />
        </button>
      </div>
    </header>
  );
};
