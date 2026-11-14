/**
 * NotificationService — CampusFlow Task & Budget Reminder Engine
 *
 * Handles:
 *  - Permission request (with graceful fallback)
 *  - Firing browser push notifications for overdue / due-today tasks
 *  - Firing budget threshold alerts (>80% and >100%)
 *  - Deduplication (won't re-fire same notification within cooldown)
 *  - Scheduling periodic checks via setInterval
 */

const STORAGE_KEY = 'campusflow_notif_fired';
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours per item dedup

/* ── Permission helpers ── */

export const getNotifPermission = () => {
  try {
    if (typeof window === 'undefined') return 'unsupported';
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  } catch {
    return 'unsupported';
  }
};

export const requestNotifPermission = async () => {
  try {
    if (typeof window === 'undefined') return 'unsupported';
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'unsupported';
  }
};

/* ── Deduplication store ── */

const getFiredMap = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const setFiredMap = (map) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch { /* ignore quota */ }
};

const wasFiredRecently = (id) => {
  const map = getFiredMap();
  const ts = map[id];
  if (!ts) return false;
  return Date.now() - ts < COOLDOWN_MS;
};

const markFired = (id) => {
  const map = getFiredMap();
  map[id] = Date.now();
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  Object.keys(map).forEach(k => { if (map[k] < cutoff) delete map[k]; });
  setFiredMap(map);
};

/* ── Fire a single notification ── */

const fire = (title, body, tag, onClick) => {
  if (Notification.permission !== 'granted') return;

  const n = new Notification(title, {
    body,
    tag,
    icon: '/icon-512.svg',
    badge: '/icon-192.svg',
    requireInteraction: false,
    silent: false,
  });

  if (onClick) n.onclick = () => { onClick(); n.close(); };
};

/* ── Main Task check function ── */

export const checkAndNotify = (todos, onClickTask) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!Array.isArray(todos) || todos.length === 0) return;

  const todayStr = new Date().toISOString().split('T')[0];

  const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
  const dueToday = todos.filter(t => !t.completed && t.dueDate === todayStr);

  // Overdue group notification
  if (overdue.length > 0) {
    const groupId = `overdue-group-${todayStr}`;
    if (!wasFiredRecently(groupId)) {
      if (overdue.length === 1) {
        fire(
          'Overdue Task Alert',
          `"${overdue[0].title}" is overdue! Review your task list.`,
          'overdue-single',
          onClickTask
        );
      } else {
        fire(
          `${overdue.length} Overdue Tasks`,
          overdue.slice(0, 3).map(t => `• ${t.title}`).join('\n') +
            (overdue.length > 3 ? `\n…and ${overdue.length - 3} more` : ''),
          'overdue-group',
          onClickTask
        );
      }
      markFired(groupId);
    }
  }

  // Due Today notifications
  dueToday.forEach(task => {
    const taskKey = `due-today-${task.id}-${todayStr}`;
    if (!wasFiredRecently(taskKey)) {
      fire(
        `Due Today: ${task.title}`,
        `Priority: ${task.priority} · Scheduled for completion today.`,
        taskKey,
        onClickTask
      );
      markFired(taskKey);
    }
  });
};

/* ── Budget Check Function ── */

export const checkBudgetAndNotify = (monthlySpent, monthlyBudget, onClickExpenses) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!monthlyBudget || monthlyBudget <= 0) return;

  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const percent = (monthlySpent / monthlyBudget) * 100;

  if (percent >= 100) {
    const key = `budget-exceeded-${currentMonthStr}`;
    if (!wasFiredRecently(key)) {
      fire(
        'Budget Exceeded Alert',
        `You have exceeded your monthly budget of ${monthlyBudget.toLocaleString('en-IN')}. Spent: ${monthlySpent.toLocaleString('en-IN')}`,
        'budget-exceeded',
        onClickExpenses
      );
      markFired(key);
    }
  } else if (percent >= 80) {
    const key = `budget-warning-80-${currentMonthStr}`;
    if (!wasFiredRecently(key)) {
      fire(
        'Budget Warning (80% Reached)',
        `You have used ${Math.round(percent)}% of your monthly budget. Remaining: ${(monthlyBudget - monthlySpent).toLocaleString('en-IN')}`,
        'budget-warning',
        onClickExpenses
      );
      markFired(key);
    }
  }
};

/* ── Scheduler ── */

let _intervalId = null;

export const startNotifScheduler = (getTodos, onClickTask, taskRemindersEnabled = true, intervalMs = 30 * 60 * 1000) => {
  stopNotifScheduler();
  if (!taskRemindersEnabled) return;

  checkAndNotify(getTodos(), onClickTask);
  _intervalId = setInterval(() => {
    checkAndNotify(getTodos(), onClickTask);
  }, intervalMs);
};

export const stopNotifScheduler = () => {
  if (_intervalId !== null) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
};
