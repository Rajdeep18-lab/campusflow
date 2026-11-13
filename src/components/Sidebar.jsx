import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  BarChart3,
  CalendarDays,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview',   icon: LayoutDashboard },
  { id: 'expenses',  label: 'Expenses',   icon: CreditCard },
  { id: 'todos',     label: 'Tasks',      icon: CheckSquare },
  { id: 'calendar',  label: 'Calendar',   icon: CalendarDays },
  { id: 'analytics', label: 'Analytics',  icon: BarChart3 },
  { id: 'settings',  label: 'Settings',   icon: Settings },
];

export const Sidebar = ({ closeMobileSidebar }) => {
  const { activePage, setActivePage, profile } = useApp();
  const { currentUser, logout } = useAuth();

  const handleNav = (id) => {
    setActivePage(id);
    closeMobileSidebar?.();
  };

  return (
    <aside
      className="app-sidebar"
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h10a6 6 0 0 1 0 12H4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12h7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            CampusFlow
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
            marginTop: 2,
            whiteSpace: 'nowrap',
          }}>
            Student Finance &amp; Tasks
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`nav-item${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  size={16}
                  className="nav-icon"
                  style={{ color: isActive ? 'var(--accent)' : undefined }}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer promo & user account */}
      <div className="sidebar-footer">
        {currentUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-base)',
              marginBottom: 10,
              gap: 8,
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div
              onClick={() => handleNav('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: 0,
                cursor: 'pointer',
                flex: 1,
              }}
              title="View Profile & Settings"
            >
              <UserAvatar size="sm" />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}>
                  {profile?.name || currentUser.displayName || 'Student'}
                </div>
                <div style={{
                  fontSize: '0.625rem',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {currentUser.email}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        <div className="sidebar-promo-card">
          <div style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: 'var(--accent)',
            background: 'var(--accent-muted)',
            padding: '3px 8px',
            borderRadius: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 6,
            border: '1px solid var(--accent-border)',
          }}>
            <ShieldCheck size={11} strokeWidth={2.5} />
            CampusFlow 2.0
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}>
            Warm Neutral · Forest Edition
          </div>
        </div>
      </div>
    </aside>
  );
};
