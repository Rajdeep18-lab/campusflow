import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultProfile = {
  name: '',
  avatarUrl: null,
  theme: 'dark',
  isOnboarded: false
};

export const AppProvider = ({ children }) => {
  // LocalStorage Persisted States
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('campusflow_profile_v2');
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse profile', e);
    }
    return defaultProfile;
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('campusflow_expenses_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse expenses', e);
      return [];
    }
  });

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('campusflow_budget_v2');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('campusflow_todos_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI & Navigation States
  const [activePage, setActivePage] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [isQuickAddExpenseOpen, setIsQuickAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Synchronize to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusflow_profile_v2', JSON.stringify(profile));
      document.documentElement.setAttribute('data-theme', profile.theme || 'dark');
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('campusflow_expenses_v2', JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('campusflow_budget_v2', JSON.stringify(monthlyBudget));
    } catch (e) {
      console.error('Failed to save budget', e);
    }
  }, [monthlyBudget]);

  useEffect(() => {
    try {
      localStorage.setItem('campusflow_todos_v2', JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  }, [todos]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Greeting Generator
  const getGreeting = () => {
    const hour = new Date().getHours();
    const displayName = profile.name ? profile.name : 'Student';
    if (hour >= 5 && hour < 12) {
      return `Good Morning, ${displayName} 👋`;
    } else if (hour >= 12 && hour < 17) {
      return `Good Afternoon, ${displayName} 👋`;
    } else {
      return `Good Evening, ${displayName} 👋`;
    }
  };

  // Onboarding Complete
  const completeOnboarding = (userName) => {
    const trimmed = userName.trim();
    if (!trimmed) return;
    setProfile(prev => ({
      ...prev,
      name: trimmed,
      isOnboarded: true
    }));
    showToast(`Welcome to CampusFlow, ${trimmed}! 🎉`);
  };

  // Expense Handlers
  const addExpense = (newExp) => {
    const amountNum = parseFloat(newExp.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid expense amount (> ₹0)', 'danger');
      return false;
    }
    const item = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newExp.title.trim(),
      amount: amountNum,
      category: newExp.category || 'Others',
      date: newExp.date || new Date().toISOString().split('T')[0],
      notes: newExp.notes ? newExp.notes.trim() : '',
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [item, ...prev]);
    showToast(`Expense "${item.title}" added (₹${item.amount.toLocaleString('en-IN')})`);
    return true;
  };

  const editExpense = (id, fields) => {
    const amountNum = parseFloat(fields.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid expense amount (> ₹0)', 'danger');
      return false;
    }
    setExpenses(prev => prev.map(e => e.id === id ? {
      ...e,
      title: fields.title.trim(),
      amount: amountNum,
      category: fields.category || 'Others',
      date: fields.date || e.date,
      notes: fields.notes ? fields.notes.trim() : ''
    } : e));
    showToast('Expense updated successfully!');
    return true;
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense deleted', 'info');
  };

  const duplicateExpense = (id) => {
    const target = expenses.find(e => e.id === id);
    if (target) {
      const dup = {
        ...target,
        id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: `${target.title} (Copy)`,
        createdAt: new Date().toISOString()
      };
      setExpenses(prev => [dup, ...prev]);
      showToast(`Duplicated "${target.title}"`);
    }
  };

  // Task / To-Do Handlers
  const addTodo = (newTodo) => {
    if (!newTodo.title || !newTodo.title.trim()) {
      showToast('Task title is required', 'danger');
      return false;
    }
    const item = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newTodo.title.trim(),
      priority: newTodo.priority || 'Medium',
      dueDate: newTodo.dueDate || new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [item, ...prev]);
    showToast(`Task "${item.title}" created!`);
    return true;
  };

  const editTodo = (id, fields) => {
    if (!fields.title || !fields.title.trim()) {
      showToast('Task title is required', 'danger');
      return false;
    }
    setTodos(prev => prev.map(t => t.id === id ? {
      ...t,
      title: fields.title.trim(),
      priority: fields.priority || 'Medium',
      dueDate: fields.dueDate || t.dueDate
    } : t));
    showToast('Task updated!');
    return true;
  };

  const toggleTodoCompleted = (id) => {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        showToast(nextState ? 'Task completed! 🎯' : 'Task marked as pending', nextState ? 'success' : 'info');
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    showToast('Task deleted', 'info');
  };

  // Budget Handlers
  const saveMonthlyBudget = (amount) => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) {
      showToast('Please enter a valid budget amount', 'danger');
      return false;
    }
    setMonthlyBudget(val);
    showToast(`Monthly budget set to ₹${val.toLocaleString('en-IN')}`);
    return true;
  };

  // Profile & Theme Handlers
  const updateProfile = (fields) => {
    setProfile(prev => ({ ...prev, ...fields }));
    showToast('Profile updated!');
  };

  const toggleTheme = () => {
    setProfile(prev => {
      const next = prev.theme === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
      return { ...prev, theme: next };
    });
  };

  // Backup & Restore Handlers
  const exportDataAsJSON = () => {
    try {
      const backupData = {
        app: 'CampusFlow',
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        profile,
        expenses,
        monthlyBudget,
        todos
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CampusFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Backup JSON file downloaded!');
    } catch {
      showToast('Failed to export backup JSON', 'danger');
    }
  };

  const importDataFromJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON format');
      }
      if (parsed.profile) setProfile(parsed.profile);
      if (Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      if (typeof parsed.monthlyBudget === 'number') setMonthlyBudget(parsed.monthlyBudget);
      if (Array.isArray(parsed.todos)) setTodos(parsed.todos);
      showToast('Data imported successfully!', 'success');
      return true;
    } catch {
      showToast('Failed to import JSON file. Please check file format.', 'danger');
      return false;
    }
  };

  const resetAllDataToDefaults = () => {
    localStorage.clear();
    setProfile(defaultProfile);
    setExpenses([]);
    setMonthlyBudget(0);
    setTodos([]);
    setActivePage('dashboard');
    showToast('All local data cleared. Fresh start initialized.', 'info');
  };

  // Dynamic Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // Total expenses for today
  const todayExpensesTotal = expenses
    .filter(e => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  // Total expenses for the current month
  const monthlyExpensesTotal = expenses
    .filter(e => e.date && e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  // Overall total expenses recorded
  const totalExpensesAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);

  const remainingBudget = monthlyBudget > 0 ? monthlyBudget - monthlyExpensesTotal : 0;
  const budgetUsagePercent = monthlyBudget > 0 ? Math.min(Math.round((monthlyExpensesTotal / monthlyBudget) * 100), 100) : 0;
  const isOverBudget = monthlyBudget > 0 && monthlyExpensesTotal > monthlyBudget;

  const pendingTasksCount = todos.filter(t => !t.completed).length;
  const completedTasksCount = todos.filter(t => t.completed).length;
  const totalTasksCount = todos.length;
  const taskCompletionPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        completeOnboarding,
        getGreeting,
        toggleTheme,

        expenses,
        addExpense,
        editExpense,
        deleteExpense,
        duplicateExpense,

        monthlyBudget,
        saveMonthlyBudget,
        remainingBudget,
        budgetUsagePercent,
        isOverBudget,

        todos,
        addTodo,
        editTodo,
        toggleTodoCompleted,
        deleteTodo,

        activePage,
        setActivePage,

        toastMessage,
        showToast,

        // Modal triggers
        isQuickAddExpenseOpen,
        setIsQuickAddExpenseOpen,
        editingExpense,
        setEditingExpense,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        // Backup
        exportDataAsJSON,
        importDataFromJSON,
        resetAllDataToDefaults,

        // Dynamic Calculations
        todayExpensesTotal,
        monthlyExpensesTotal,
        totalExpensesAllTime,
        pendingTasksCount,
        completedTasksCount,
        totalTasksCount,
        taskCompletionPercent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
