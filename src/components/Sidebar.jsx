import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  BarChart3,
  CalendarDays,
  Settings,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'expenses',  label: 'Expenses',   icon: CreditCard },
  { id: 'todos',     label: 'Tasks',      icon: CheckSquare },
  { id: 'analytics', label: 'Analytics',  icon: BarChart3 },
  { id: 'calendar',  label: 'Calendar',   icon: CalendarDays },
  { id: 'settings',  label: 'Settings',   icon: Settings },
];

export const Sidebar = ({ closeMobileSidebar }) => {
  const { activePage, setActivePage } = useApp();

  const handleNav = (id) => {
    setActivePage(id);
    closeMobileSidebar?.();
  };

  return (
    <aside
      className="app-sidebar"
      style={{ width: 220 }}
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, #E8A33D, #d9922c)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h10a6 6 0 0 1 0 12H4" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12h7" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
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
            Expense & Task Hub
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
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
                  strokeWidth={isActive ? 2 : 1.8}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer promo */}
      <div className="sidebar-footer">
        <div className="sidebar-promo-card">
          <div style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: 'var(--color-success)',
            background: 'rgba(52,199,123,0.12)',
            padding: '3px 8px',
            borderRadius: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 8,
            border: '1px solid rgba(52,199,123,0.25)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
            100% Offline Hub
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            CampusFlow Pro
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: 10,
          }}>
            Private local storage
          </div>
        </div>
      </div>
    </aside>
  );
};
