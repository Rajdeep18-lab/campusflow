import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  getNotifPermission,
  requestNotifPermission,
  checkAndNotify,
  startNotifScheduler,
  stopNotifScheduler,
} from '../services/NotificationService';
import { useAuth } from './AuthContext';
import { migrateLocalDataToFirestore } from '../firebase/firestore';

const AppContext = createContext();

const defaultProfile = {
  name: '',
  avatarUrl: null,
  theme: 'dark',
  isOnboarded: false,
};

// Helper to get storage keys based on user UID
const getUserStorageKeys = (uid) => {
  if (!uid) {
    return {
      profile: 'campusflow_profile_v2',
      expenses: 'campusflow_expenses_v2',
      budget: 'campusflow_budget_v2',
      todos: 'campusflow_todos_v2',
      migrated: 'campusflow_migrated_v2',
    };
  }
  return {
    profile: `campusflow_${uid}_profile`,
    expenses: `campusflow_${uid}_expenses`,
    budget: `campusflow_${uid}_budget`,
    todos: `campusflow_${uid}_todos`,
    migrated: `campusflow_${uid}_migrated`,
  };
};

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const currentUid = currentUser?.uid || null;

  // Initial load helper
  const loadInitialData = useCallback((uid) => {
    const keys = getUserStorageKeys(uid);
    let loadedProfile = { ...defaultProfile };
    let loadedExpenses = [];
    let loadedBudget = 0;
    let loadedTodos = [];

    try {
      // Check if migration is needed for this user
      if (uid) {
        const isAlreadyMigrated = localStorage.getItem(keys.migrated);
        const userHasExistingData = localStorage.getItem(keys.expenses);

        // If not migrated and user has no scoped data yet, check for legacy data
        if (!isAlreadyMigrated && !userHasExistingData) {
          const legacyProfileStr = localStorage.getItem('campusflow_profile_v2');
          const legacyExpensesStr = localStorage.getItem('campusflow_expenses_v2');
          const legacyBudgetStr = localStorage.getItem('campusflow_budget_v2');
          const legacyTodosStr = localStorage.getItem('campusflow_todos_v2');

          if (legacyProfileStr) {
            try { loadedProfile = { ...defaultProfile, ...JSON.parse(legacyProfileStr) }; } catch { /* ignore */ }
          }
          if (legacyExpensesStr) {
            try { loadedExpenses = JSON.parse(legacyExpensesStr); } catch { /* ignore */ }
          }
          if (legacyBudgetStr) {
            try { loadedBudget = JSON.parse(legacyBudgetStr); } catch { /* ignore */ }
          }
          if (legacyTodosStr) {
            try { loadedTodos = JSON.parse(legacyTodosStr); } catch { /* ignore */ }
          }

          // If user displayName exists from auth, populate it
          if (!loadedProfile.name && currentUser?.displayName) {
            loadedProfile.name = currentUser.displayName;
          }

          // Copy into scoped storage for this user (PRESERVING legacy storage as requested)
          localStorage.setItem(keys.profile, JSON.stringify(loadedProfile));
          localStorage.setItem(keys.expenses, JSON.stringify(loadedExpenses));
          localStorage.setItem(keys.budget, JSON.stringify(loadedBudget));
          localStorage.setItem(keys.todos, JSON.stringify(loadedTodos));
          localStorage.setItem(keys.migrated, 'true');

          // Trigger background migration to Cloud Firestore if available
          migrateLocalDataToFirestore(uid, {
            profile: loadedProfile,
            expenses: loadedExpenses,
            monthlyBudget: loadedBudget,
            todos: loadedTodos,
          }).catch(err => console.warn('[CampusFlow] Background Firestore migration note:', err));

          return { profile: loadedProfile, expenses: loadedExpenses, budget: loadedBudget, todos: loadedTodos };
        }
      }

      // Standard load from scoped keys
      const savedProfile = localStorage.getItem(keys.profile);
      if (savedProfile) {
        loadedProfile = { ...defaultProfile, ...JSON.parse(savedProfile) };
      } else if (currentUser?.displayName) {
        loadedProfile.name = currentUser.displayName;
      }

      const savedExpenses = localStorage.getItem(keys.expenses);
      if (savedExpenses) {
        loadedExpenses = JSON.parse(savedExpenses);
      }

      const savedBudget = localStorage.getItem(keys.budget);
      if (savedBudget) {
        loadedBudget = JSON.parse(savedBudget);
      }

      const savedTodos = localStorage.getItem(keys.todos);
      if (savedTodos) {
        loadedTodos = JSON.parse(savedTodos);
      }
    } catch (e) {
      console.error('[CampusFlow] Failed to load data from storage:', e);
    }

    return { profile: loadedProfile, expenses: loadedExpenses, budget: loadedBudget, todos: loadedTodos };
  }, [currentUser]);

  const initialData = loadInitialData(currentUid);

  const [profile, setProfile] = useState(initialData.profile);
  const [expenses, setExpenses] = useState(initialData.expenses);
  const [monthlyBudget, setMonthlyBudget] = useState(initialData.budget);
  const [todos, setTodos] = useState(initialData.todos);

  // When authenticated user changes (login, logout, switch account), reload data safely
  useEffect(() => {
    const data = loadInitialData(currentUid);
    setProfile(data.profile);
    setExpenses(data.expenses);
    setMonthlyBudget(data.budget);
    setTodos(data.todos);
  }, [currentUid, loadInitialData]);

  // UI & Navigation States
  const [activePage, setActivePage] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);

  // Notification permission state
  const [notifPermission, setNotifPermission] = useState(() => getNotifPermission());

  // Modal States
  const [isQuickAddExpenseOpen, setIsQuickAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Synchronize to LocalStorage using user-scoped keys
  useEffect(() => {
    const keys = getUserStorageKeys(currentUid);
    try {
      localStorage.setItem(keys.profile, JSON.stringify(profile));
      document.documentElement.setAttribute('data-theme', profile.theme || 'dark');
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile, currentUid]);

  useEffect(() => {
    const keys = getUserStorageKeys(currentUid);
    try {
      localStorage.setItem(keys.expenses, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses', e);
    }
  }, [expenses, currentUid]);

  useEffect(() => {
    const keys = getUserStorageKeys(currentUid);
    try {
      localStorage.setItem(keys.budget, JSON.stringify(monthlyBudget));
    } catch (e) {
      console.error('Failed to save budget', e);
    }
  }, [monthlyBudget, currentUid]);

  useEffect(() => {
    const keys = getUserStorageKeys(currentUid);
    try {
      localStorage.setItem(keys.todos, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  }, [todos, currentUid]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Notification helpers ──
  const todosRef = useRef(todos);
  useEffect(() => { todosRef.current = todos; }, [todos]);

  const goToTodos = useCallback(() => {
    try {
      setActivePage('todos');
      if (typeof window !== 'undefined') window.focus();
    } catch { /* ignore */ }
  }, []);

  // Start / restart scheduler whenever permission changes
  useEffect(() => {
    try {
      if (notifPermission === 'granted') {
        startNotifScheduler(() => todosRef.current, goToTodos);
      } else {
        stopNotifScheduler();
      }
    } catch { /* ignore */ }
    return () => { try { stopNotifScheduler(); } catch { /* ignore */ } };
  }, [notifPermission, goToTodos]);

  // Also re-check notifications immediately whenever todos change
  useEffect(() => {
    try {
      if (notifPermission === 'granted') {
        checkAndNotify(todos, goToTodos);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  const requestNotifications = async () => {
    try {
      const result = await requestNotifPermission();
      setNotifPermission(result);
      if (result === 'granted') {
        showToast("🔔 Notifications enabled! You'll get task reminders.", 'success');
        checkAndNotify(todos, goToTodos);
      } else if (result === 'denied') {
        showToast('Notifications blocked. Enable them in browser settings.', 'danger');
      }
      return result;
    } catch {
      return 'unsupported';
    }
  };

  // Greeting Generator
  const getGreeting = () => {
    const hour = new Date().getHours();
    const displayName = profile.name || currentUser?.displayName || 'Student';
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
      isOnboarded: true,
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
      createdAt: new Date().toISOString(),
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
      notes: fields.notes ? fields.notes.trim() : '',
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
        createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
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
      dueDate: fields.dueDate || t.dueDate,
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
        version: '2.0.0',
        userId: currentUid,
        userEmail: currentUser?.email || null,
        exportDate: new Date().toISOString(),
        profile,
        expenses,
        monthlyBudget,
        todos,
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
    const keys = getUserStorageKeys(currentUid);
    try {
      localStorage.removeItem(keys.profile);
      localStorage.removeItem(keys.expenses);
      localStorage.removeItem(keys.budget);
      localStorage.removeItem(keys.todos);
    } catch (e) {
      console.error(e);
    }
    setProfile(defaultProfile);
    setExpenses([]);
    setMonthlyBudget(0);
    setTodos([]);
    setActivePage('dashboard');
    showToast('Your user data has been cleared. Fresh start initialized.', 'info');
  };

  // Dynamic Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  const todayExpensesTotal = expenses
    .filter(e => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyExpensesTotal = expenses
    .filter(e => e.date && e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

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

        // Notifications
        notifPermission,
        requestNotifications,

        // Dynamic Calculations
        todayExpensesTotal,
        monthlyExpensesTotal,
        totalExpensesAllTime,
        pendingTasksCount,
        completedTasksCount,
        totalTasksCount,
        taskCompletionPercent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
