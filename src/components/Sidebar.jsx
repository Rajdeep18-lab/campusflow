import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

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
  const { currentUser } = useAuth();

  const handleNav = (id) => {
    setActivePage(id);
    closeMobileSidebar?.();
  };

  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Rajdeep');
  const initial = (displayName.charAt(0) || 'R').toUpperCase();

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      {/* Brand Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          C
        </div>
        <span className="sidebar-logo-text">CampusFlow</span>
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
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
                strokeWidth={1.75}
                className="nav-icon"
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-saved-badge">
          <span className="sidebar-saved-dot" />
          <span>Saved on this device</span>
        </div>

        <div
          className="sidebar-user-row"
          onClick={() => handleNav('settings')}
          title="Account & Settings"
          role="button"
          tabIndex={0}
        >
          <div className="sidebar-avatar-circle">
            {initial}
          </div>
          <span className="sidebar-user-name">
            {displayName}
          </span>
        </div>
      </div>
    </aside>
  );
};
