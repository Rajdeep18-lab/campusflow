import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QuickAddExpenseModal } from './components/QuickAddExpenseModal';
import { TaskModal } from './components/TaskModal';
import { BudgetModal } from './components/BudgetModal';
import { Toast } from './components/Toast';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWAUpdater, PWAOfflineIndicator } from './components/PWAStatus';
import { Plus, CreditCard, CheckSquare } from 'lucide-react';

import { DashboardView } from './views/DashboardView';
import { ExpenseView } from './views/ExpenseView';
import { TodoView } from './views/TodoView';
import { AnalyticsView } from './views/AnalyticsView';
import { CalendarView } from './views/CalendarView';
import { SettingsView } from './views/SettingsView';

const MainContent = () => {
  const { activePage, setIsQuickAddExpenseOpen, setIsTaskModalOpen } = useApp();
  const [fabOpen, setFabOpen] = useState(false);

  const renderView = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardView />;
      case 'expenses': return <ExpenseView />;
      case 'todos': return <TodoView />;
      case 'analytics': return <AnalyticsView />;
      case 'calendar': return <CalendarView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  const handleAddExpense = () => {
    setFabOpen(false);
    setIsQuickAddExpenseOpen(true);
  };

  const handleAddTask = () => {
    setFabOpen(false);
    setIsTaskModalOpen(true);
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

      {/* FAB Backdrop */}
      {fabOpen && (
        <div
          onClick={() => setFabOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 97,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Speed-dial options */}
      <div
        style={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          zIndex: 98,
          pointerEvents: fabOpen ? 'auto' : 'none',
        }}
      >
        {/* Add Expense option */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: fabOpen ? 1 : 0,
            transform: fabOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
            transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            transitionDelay: fabOpen ? '0.06s' : '0s',
          }}
        >
          <span style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            Add Expense
          </span>
          <button
            onClick={handleAddExpense}
            title="Add Expense"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8A33D, #d9922c)',
              color: '#0F172A',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(232,163,61,0.5)',
              flexShrink: 0,
            }}
          >
            <CreditCard size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Add Task option */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: fabOpen ? 1 : 0,
            transform: fabOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.85)',
            transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            transitionDelay: '0s',
          }}
        >
          <span style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            Add Task
          </span>
          <button
            onClick={handleAddTask}
            title="Add Task"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C8EF5, #5a7de8)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(108,142,245,0.5)',
              flexShrink: 0,
            }}
          >
            <CheckSquare size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Main FAB toggle button */}
      <button
        className="fab-button"
        onClick={() => setFabOpen(prev => !prev)}
        title="Quick Add"
      >
        <span style={{
          display: 'inline-flex',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <Plus size={26} />
        </span>
      </button>

      {/* Overlays & Modals */}
      <OnboardingModal />
      <GlobalSearchModal />
      <QuickAddExpenseModal />
      <TaskModal />
      <BudgetModal />
      <Toast />

      {/* PWA Components */}
      <PWAInstallBanner />
      <PWAUpdater />
      <PWAOfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
