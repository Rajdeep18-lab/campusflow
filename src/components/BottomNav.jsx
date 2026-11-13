import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  CalendarDays,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview',  icon: LayoutDashboard },
  { id: 'expenses',  label: 'Expenses',  icon: CreditCard },
  { id: 'todos',     label: 'Tasks',     icon: CheckSquare },
  { id: 'calendar',  label: 'Calendar',  icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
              strokeWidth={isActive ? 2.3 : 1.8}
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                lineHeight: 1.2,
                transition: 'all 0.15s',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
