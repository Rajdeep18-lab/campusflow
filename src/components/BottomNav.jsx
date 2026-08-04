import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  BarChart3,
  CalendarDays,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',      icon: LayoutDashboard },
  { id: 'expenses',  label: 'Expenses',  icon: CreditCard },
  { id: 'todos',     label: 'Tasks',     icon: CheckSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'calendar',  label: 'Calendar',  icon: CalendarDays },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

export const BottomNav = () => {
  const { activePage, setActivePage } = useApp();

  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`mobile-nav-item${isActive ? ' active' : ''}`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            />
            <span style={{
              fontSize: '0.625rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              lineHeight: 1,
              transition: 'all 0.15s',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
