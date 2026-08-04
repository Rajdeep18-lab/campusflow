import React from 'react';
import {
  GraduationCap,
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
        <div className="sidebar-logo-icon">
          <GraduationCap size={17} color="#fff" strokeWidth={2.2} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '0.875rem',
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
            marginTop: 1,
            whiteSpace: 'nowrap',
          }}>
            Expense & Task Hub
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  size={15}
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

      {/* Footer promo */}
      <div className="sidebar-footer">
        <div className="sidebar-promo-card">
          <div style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px',
          }}>
            <Sparkles size={15} color="var(--accent)" />
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            Stay Productive
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: 10,
          }}>
            Track. Manage. Achieve.
          </div>
          <button
            onClick={() => handleNav('dashboard')}
            style={{
              width: '100%',
              padding: '6px 0',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </aside>
  );
};
