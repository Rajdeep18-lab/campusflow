/**
 * NotificationService — CampusFlow Task Reminder Engine
 *
 * Handles:
 *  - Permission request (with graceful fallback)
 *  - Firing browser push notifications for overdue / due-today tasks
 *  - Deduplication (won't re-fire same notification within 6 hours)
 *  - Scheduling periodic checks via setInterval
 */

const STORAGE_KEY = 'campusflow_notif_fired';
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours per-task dedup

/* ── Permission helpers ── */

export const getNotifPermission = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

export const requestNotifPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
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
  // Cleanup old entries (> 2 days)
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  Object.keys(map).forEach(k => { if (map[k] < cutoff) delete map[k]; });
  setFiredMap(map);
};

/* ── Fire a single notification ── */

const fire = (title, body, tag, onClick) => {
  if (Notification.permission !== 'granted') return;

  const n = new Notification(title, {
    body,
    tag, // deduplicates same-tag notifs in notification center
    icon: '/icon-512.svg',
    badge: '/icon-192.svg',
    requireInteraction: false,
    silent: false,
  });

  if (onClick) n.onclick = () => { onClick(); n.close(); };
};

/* ── Main check function ── */

/**
 * @param {Array} todos - current todo list from context
 * @param {Function} onClickTask - callback when user taps a task notification
 */
export const checkAndNotify = (todos, onClickTask) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!Array.isArray(todos) || todos.length === 0) return;

  const todayStr = new Date().toISOString().split('T')[0];

  const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
  const dueToday = todos.filter(t => !t.completed && t.dueDate === todayStr);

  // ── Overdue group notification ──
  if (overdue.length > 0) {
    const groupId = `overdue-group-${todayStr}`;
    if (!wasFiredRecently(groupId)) {
      if (overdue.length === 1) {
        fire(
          '🔴 Overdue Task',
          `"${overdue[0].title}" is overdue! Complete it now.`,
          'overdue-single',
          onClickTask
        );
      } else {
        fire(
          `🔴 ${overdue.length} Overdue Tasks`,
          overdue.slice(0, 3).map(t => `• ${t.title}`).join('\n') +
            (overdue.length > 3 ? `\n…and ${overdue.length - 3} more` : ''),
          'overdue-group',
          onClickTask
        );
      }
      markFired(groupId);
    }
  }

  // ── Due Today notifications (per-task, to avoid spam only fire each once per day) ──
  dueToday.forEach(task => {
    const taskKey = `due-today-${task.id}-${todayStr}`;
    if (!wasFiredRecently(taskKey)) {
      fire(
        `⏰ Due Today: ${task.title}`,
        `Priority: ${task.priority} · Don't forget to complete this today!`,
        taskKey,
        onClickTask
      );
      markFired(taskKey);
    }
  });
};

/* ── Scheduler ── */

let _intervalId = null;

/**
 * Start a periodic check every `intervalMs` milliseconds.
 * Clears any existing interval first.
 */
export const startNotifScheduler = (getTodos, onClickTask, intervalMs = 30 * 60 * 1000) => {
  stopNotifScheduler();
  // Fire once immediately
  checkAndNotify(getTodos(), onClickTask);
  // Then on interval
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
