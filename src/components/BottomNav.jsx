import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  CalendarDays,
  Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'dashboard', label: 'Overview',  icon: LayoutDashboard },
  { id: 'expenses',  label: 'Expenses',  icon: CreditCard },
  { id: 'todos',     label: 'Tasks',     icon: CheckSquare },
  { id: 'calendar',  label: 'Calendar',  icon: CalendarDays },
  { id: 'more',      label: 'More',      icon: Menu },
];

export const BottomNav = () => {
  const { activePage, setActivePage, isMobileMoreOpen, setIsMobileMoreOpen } = useApp();

  const handleTabClick = (id) => {
    if (id === 'more') {
      setIsMobileMoreOpen(prev => !prev);
    } else {
      setIsMobileMoreOpen(false);
      setActivePage(id);
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isMoreTab = id === 'more';
        const isActive = isMoreTab
          ? isMobileMoreOpen || ['analytics', 'profile', 'settings'].includes(activePage)
          : !isMobileMoreOpen && activePage === id;

        return (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`bottom-nav-tab${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            aria-expanded={isMoreTab ? isMobileMoreOpen : undefined}
            title={label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.75} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
