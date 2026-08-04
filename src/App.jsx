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
import { Plus } from 'lucide-react';

import { DashboardView } from './views/DashboardView';
import { ExpenseView } from './views/ExpenseView';
import { TodoView } from './views/TodoView';
import { AnalyticsView } from './views/AnalyticsView';
import { CalendarView } from './views/CalendarView';
import { SettingsView } from './views/SettingsView';

const MainContent = () => {
  const { activePage, setIsQuickAddExpenseOpen, setIsTaskModalOpen } = useApp();

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

      {/* Floating Action Button (FAB) on Mobile/Desktop */}
      <button 
        className="fab-button" 
        onClick={() => {
          if (activePage === 'todos') {
            setIsTaskModalOpen(true);
          } else {
            setIsQuickAddExpenseOpen(true);
          }
        }}
        title={activePage === 'todos' ? 'Create New Task' : 'Quick Add Expense'}
      >
        <Plus size={26} />
      </button>

      {/* Overlays & Modals */}
      <OnboardingModal />
      <GlobalSearchModal />
      <QuickAddExpenseModal />
      <TaskModal />
      <BudgetModal />
      <Toast />
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
