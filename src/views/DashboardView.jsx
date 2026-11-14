import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getCategoryColor } from '../utils/categoryColors';

export const DashboardView = () => {
  const {
    getGreeting,
    expenses,
    todos,
    monthlyBudget,
    todayExpensesTotal,
    remainingBudget,
    budgetUsagePercent,
    setIsQuickAddExpenseOpen,
    setIsTaskModalOpen,
    setActivePage,
    toggleTodoCompleted,
    formatCurrency,
    formatDate,
    customCategories,
    profile,
  } = useApp();

  const { currentUser } = useAuth();
  const displayName = profile?.name || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Rajdeep');

  // Dates
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const currentMonthNum = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();
  const monthAbbr = now.toLocaleDateString('en-IN', { month: 'short' });
  const monthPrefix = `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}`;

  // Transactions data
  const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(monthPrefix));
  const monthSpent = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const todayTransactions = expenses.filter(e => e.date === todayStr);
  const dailyAverage = currentDay > 0 ? Math.round(monthSpent / currentDay) : 0;

  // Daily spending array for chart (days 1 to currentDay)
  const dailyBars = Array.from({ length: currentDay }, (_, i) => {
    const dayNum = i + 1;
    const dateKey = `${monthPrefix}-${String(dayNum).padStart(2, '0')}`;
    const amount = expenses
      .filter(e => e.date === dateKey)
      .reduce((s, e) => s + Number(e.amount || 0), 0);
    return { day: dayNum, amount, isToday: dayNum === currentDay };
  });
  const maxDayAmount = Math.max(...dailyBars.map(d => d.amount), 1);

  // Tasks data
  const pendingTodos = todos.filter(t => !t.completed);
  const dueIn2Days = pendingTodos.filter(t => {
    if (!t.dueDate) return false;
    const diffDays = Math.ceil((new Date(t.dueDate + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  }).length;

  // Next deadline
  const sortedUpcoming = [...pendingTodos]
    .filter(t => t.dueDate && t.dueDate >= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const nextTask = sortedUpcoming[0];

  const formatRelativeDays = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.ceil((new Date(dateStr + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  const formatTaskDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayVal = d.getDate();
    const mName = d.toLocaleDateString('en-IN', { month: 'short' });
    const diff = Math.ceil((d - new Date(todayStr + 'T00:00:00')) / (1000 * 60 * 60 * 24));
    const rel = diff === 0 ? 'today' : diff === 1 ? 'in 1 day' : `in ${diff} days`;
    return `${dayName}, ${dayVal} ${mName} · ${rel}`;
  };

  // Recent transactions (up to 4)
  const recentTransactions = [...expenses]
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 4);

  // Today's priorities
  const priorityTasks = [...pendingTodos]
    .sort((a, b) => {
      const pOrder = { High: 1, Medium: 2, Low: 3 };
      return (pOrder[a.priority] || 4) - (pOrder[b.priority] || 4);
    })
    .slice(0, 3);

  // Upcoming deadlines (up to 3)
  const upcomingDeadlines = sortedUpcoming.slice(0, 3);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1.25,
          }}>
            {getGreeting()}, {displayName}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
            {dateFormatted}
          </p>
        </div>

        {/* Desktop Header Buttons */}
        <div className="hidden md:flex" style={{ gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="btn btn-secondary"
          >
            <Plus size={14} strokeWidth={2} />
            <span>Add task</span>
          </button>
          <button
            onClick={() => setIsQuickAddExpenseOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={14} strokeWidth={2} />
            <span>Add expense</span>
          </button>
        </div>
      </div>

      {/* Mobile Action Buttons (under greeting) */}
      <div className="flex md:hidden" style={{ gap: 8 }}>
        <button
          onClick={() => setIsQuickAddExpenseOpen(true)}
          className="btn btn-primary"
          style={{ flex: 1, height: 42 }}
        >
          <Plus size={15} strokeWidth={2} />
          <span>Expense</span>
        </button>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="btn btn-secondary"
          style={{ flex: 1, height: 42 }}
        >
          <Plus size={15} strokeWidth={2} />
          <span>Task</span>
        </button>
      </div>

      {/* ── Summary Strip (4 cells in 1 container) ── */}
      <div className="summary-strip">
        {/* Cell 1: Spent today */}
        <div className="summary-cell">
          <div className="summary-label">Spent today</div>
          <div className="summary-number num">
            {formatCurrency(todayExpensesTotal)}
          </div>
          <div className="summary-hint">
            {todayTransactions.length} transaction{todayTransactions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Cell 2: Budget remaining */}
        <div className="summary-cell">
          <div className="summary-label">Budget remaining</div>
          <div className="summary-number num">
            {remainingBudget > 0 ? formatCurrency(remainingBudget) : (monthlyBudget > 0 ? formatCurrency(0) : '—')}
          </div>
          {monthlyBudget > 0 && (
            <div style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'var(--border)',
              margin: '6px 0 2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 2,
                width: `${Math.min(budgetUsagePercent, 100)}%`,
                background: 'var(--accent)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          )}
          <div className="summary-hint">
            {monthlyBudget > 0
              ? `${formatCurrency(monthSpent)} of ${formatCurrency(monthlyBudget)} used`
              : 'Set monthly budget in Settings'}
          </div>
        </div>

        {/* Cell 3: Pending tasks */}
        <div className="summary-cell">
          <div className="summary-label">Pending tasks</div>
          <div className="summary-number">
            {pendingTodos.length}
          </div>
          <div className="summary-hint">
            {dueIn2Days > 0 ? `${dueIn2Days} due in the next 2 days` : 'No upcoming deadlines soon'}
          </div>
        </div>

        {/* Cell 4: Next deadline */}
        <div className="summary-cell">
          <div className="summary-label">Next deadline</div>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
            marginTop: 2,
          }}>
            {nextTask ? nextTask.title : 'No pending tasks'}
          </div>
          <div className="summary-hint">
            {nextTask ? formatTaskDateLabel(nextTask.dueDate) : 'All caught up!'}
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 20,
        alignItems: 'flex-start',
        width: '100%',
      }}>
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Card: Spending this month */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Spending this month</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Daily, 1–{currentDay} {monthAbbr} · avg ₹{dailyAverage}
              </span>
            </div>

            {/* Daily Bars Chart */}
            <div style={{
              height: 120,
              display: 'flex',
              alignItems: 'flex-end',
              gap: currentDay > 15 ? 2 : 4,
              paddingTop: 16,
              paddingBottom: 4,
              overflow: 'hidden',
            }}>
              {dailyBars.map(({ day, amount, isToday }) => {
                const heightPct = maxDayAmount > 0 ? Math.max((amount / maxDayAmount) * 100, 4) : 4;
                return (
                  <div
                    key={day}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                    title={`Day ${day}: ₹${amount.toLocaleString('en-IN')}`}
                  >
                    <div style={{
                      width: '100%',
                      minHeight: 4,
                      height: `${heightPct}%`,
                      borderRadius: '2px 2px 0 0',
                      background: isToday ? 'var(--accent-solid)' : 'var(--chart-bar-muted)',
                      transition: 'height 0.3s ease',
                    }} />
                  </div>
                );
              })}
            </div>

            {/* X-axis tick markers */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-muted)',
              paddingTop: 4,
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <span>1</span>
              {currentDay > 10 && <span>{Math.round(currentDay / 2)}</span>}
              <span>{currentDay}</span>
            </div>
          </div>

          {/* Card: Recent transactions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent transactions</span>
              <button
                onClick={() => setActivePage('expenses')}
                className="card-action-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                View all
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No transactions yet. Click "+ Add expense" to record one.
              </div>
            ) : (
              <div>
                {recentTransactions.map((exp, idx) => {
                  const catColor = getCategoryColor(exp.category, profile?.theme === 'dark' ? 'dark' : 'light', customCategories);
                  return (
                    <div
                      key={exp.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                        borderBottom: idx < recentTransactions.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: catColor, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {exp.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            {exp.category} · {exp.paymentMethod || 'UPI'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }} className="num">
                          −{formatCurrency(exp.amount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }} className="num">
                          {exp.date === todayStr ? 'Today' : formatDate(exp.date)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Card: Today's priorities */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Today's priorities</span>
              <button
                onClick={() => setActivePage('todos')}
                className="card-action-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                All tasks
              </button>
            </div>

            {priorityTasks.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No pending tasks. Great job!
              </div>
            ) : (
              <div>
                {priorityTasks.map((todo, idx) => {
                  const pColors = {
                    High:   { dot: '#B42318', label: 'High' },
                    Medium: { dot: '#A06A15', label: 'Medium' },
                    Low:    { dot: '#2E7D4F', label: 'Low' },
                  };
                  const p = pColors[todo.priority] || pColors.Medium;

                  return (
                    <div
                      key={todo.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: idx < priorityTasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodoCompleted(todo.id)}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            cursor: 'pointer',
                            accentColor: 'var(--accent-solid)',
                            flexShrink: 0,
                          }}
                        />
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 400,
                          color: todo.completed ? 'var(--text-muted)' : 'var(--text)',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {todo.title}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '12px',
                        color: p.dot,
                        fontWeight: 500,
                        flexShrink: 0,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot }} />
                        <span>{p.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card: Upcoming deadlines */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Upcoming deadlines</span>
              <button
                onClick={() => setActivePage('calendar')}
                className="card-action-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                Calendar
              </button>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No scheduled deadlines.
              </div>
            ) : (
              <div>
                {upcomingDeadlines.map((task, idx) => {
                  const d = new Date(task.dueDate + 'T00:00:00');
                  const dayNum = d.getDate();
                  const mAbbr = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
                  const relDays = formatRelativeDays(task.dueDate);

                  return (
                    <div
                      key={task.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '10px 0',
                        borderBottom: idx < upcomingDeadlines.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}
                    >
                      {/* Date badge box */}
                      <div style={{
                        width: 36,
                        height: 40,
                        borderRadius: 7,
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          lineHeight: 1,
                        }}>
                          {dayNum}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          marginTop: 2,
                          letterSpacing: '0.04em',
                        }}>
                          {mAbbr}
                        </span>
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                          {relDays}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
