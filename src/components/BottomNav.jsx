import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  CalendarDays,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'dashboard', label: 'Overview',  icon: LayoutDashboard },
  { id: 'expenses',  label: 'Expenses',  icon: CreditCard },
  { id: 'todos',     label: 'Tasks',     icon: CheckSquare },
  { id: 'calendar',  label: 'Calendar',  icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export const BottomNav = () => {
  const { activePage, setActivePage } = useApp();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`bottom-nav-tab${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
