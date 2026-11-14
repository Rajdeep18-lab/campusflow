import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QuickAddExpenseModal } from './components/QuickAddExpenseModal';
import { TaskModal } from './components/TaskModal';
import { BudgetModal } from './components/BudgetModal';
import { DownloadReportModal } from './components/DownloadReportModal';
import { Toast } from './components/Toast';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWAUpdater, PWAOfflineIndicator } from './components/PWAStatus';

import { DashboardView } from './views/DashboardView';
import { ExpenseView } from './views/ExpenseView';
import { TodoView } from './views/TodoView';
import { AnalyticsView } from './views/AnalyticsView';
import { CalendarView } from './views/CalendarView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { AuthView } from './views/AuthView';

const MainContent = () => {
  const { activePage } = useApp();

  const renderView = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardView />;
      case 'expenses':  return <ExpenseView />;
      case 'todos':     return <TodoView />;
      case 'analytics': return <AnalyticsView />;
      case 'calendar':  return <CalendarView />;
      case 'settings':  return <SettingsView />;
      case 'profile':   return <ProfileView />;
      default:          return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar (>=768px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />
        <main className="page-body">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (<768px) */}
      <BottomNav />

      {/* Overlays & Modals */}
      <OnboardingModal />
      <GlobalSearchModal />
      <QuickAddExpenseModal />
      <TaskModal />
      <BudgetModal />
      <DownloadReportModal />
      <Toast />

      {/* PWA Components */}
      <PWAInstallBanner />
      <PWAUpdater />
      <PWAOfflineIndicator />
    </div>
  );
};

export default function App() {
  const { currentUser, loading } = useAuth();

  // Loading splash while checking auth state
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-canvas)',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 7,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          C
        </div>
        <div
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          CampusFlow
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Loading your workspace...
        </div>
      </div>
    );
  }

  // If not logged in, show Auth View (Login / Signup / Forgot Password)
  if (!currentUser) {
    return <AuthView />;
  }

  // Authenticated: provide AppContext scoped to this user
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
