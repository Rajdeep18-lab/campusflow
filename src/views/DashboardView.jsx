import React, { useState } from 'react';
import {
  CreditCard,
  CheckSquare,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

const CATEGORY_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

const CATEGORY_COLORS = {
  Food: '#10b981', Travel: '#06b6d4', Books: '#3b82f6',
  Hostel: '#8b5cf6', Mess: '#ec4899', Shopping: '#f59e0b',
  Recharge: '#14b8a6', Entertainment: '#6366f1', Others: '#64748b',
};

/* ─── Reusable Stat Card ─── */
const StatCard = ({ label, value, sub, icon: Icon, iconBg, iconColor, onClick }) => (
  <div
    className="stat-card"
    onClick={onClick}
    style={onClick ? { cursor: 'pointer' } : undefined}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <span className="stat-label">{label}</span>
      <div className="stat-icon-box" style={{ background: iconBg }}>
        <Icon size={16} color={iconColor} strokeWidth={2} />
      </div>
    </div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

/* ─── Priority Badge ─── */
const PriorityBadge = ({ priority }) => {
  const map = {
    High:   'badge badge-danger',
    Medium: 'badge badge-warning',
    Low:    'badge badge-success',
  };
  return <span className={map[priority] || 'badge badge-neutral'}>{priority}</span>;
};

/* ─── Section Header ─── */
const SectionHeader = ({ icon: Icon, iconBg, iconColor, title, subtitle, actions }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 'var(--radius-md)',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid var(--border-base)',
      }}>
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </div>
      <div>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: 3,
          fontWeight: 400,
        }}>
          {subtitle}
        </p>
      </div>
    </div>
    {actions && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {actions}
      </div>
    )}
  </div>
);

export const DashboardView = () => {
  const {
    getGreeting,
    expenses,
    todos,
    monthlyBudget,
    todayExpensesTotal,
    remainingBudget,
    taskCompletionPercent,
    setIsQuickAddExpenseOpen,
    setIsTaskModalOpen,
    setIsBudgetModalOpen,
    setActivePage,
    toggleTodoCompleted,
    deleteExpense,
    deleteTodo,
    isOverBudget,
  } = useApp();

  const [expSearch] = useState('');
  const [expCat]    = useState('All');
  const [taskTab]   = useState('all');

  const todayStr   = new Date().toISOString().split('T')[0];
  const todayTasks = todos.filter(t => t.dueDate === todayStr);

  /* Filtered expenses */
  const filteredExp = expenses.filter(e => {
    const catOk    = expCat === 'All' || e.category === expCat;
    const searchOk = !expSearch.trim() ||
      e.title.toLowerCase().includes(expSearch.toLowerCase()) ||
      e.category.toLowerCase().includes(expSearch.toLowerCase());
    return catOk && searchOk;
  });

  /* Filtered tasks */
  const filteredTodos = todos.filter(t => {
    if (taskTab === 'today')     return t.dueDate === todayStr;
    if (taskTab === 'pending')   return !t.completed;
    if (taskTab === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* ═══════════════════════════════════════════════
          TODAY SNAPSHOT & GREETING HEADER
         ═══════════════════════════════════════════════ */}
      <div className="today-snapshot">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                {getGreeting()}
              </h1>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Here is your daily snapshot for {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={13} strokeWidth={2.5} />
              Add Expense
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm">
              <Plus size={13} strokeWidth={2.5} />
              Add Task
            </button>
          </div>
        </div>

        {/* 4 Key Snapshot Metric Chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          marginTop: 20,
        }}>
          {/* Today's Expense */}
          <div style={{
            background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's Spend
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em', marginTop: 2 }}>
              ₹{todayExpensesTotal.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Today's Tasks */}
          <div style={{
            background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's Tasks
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.02em', marginTop: 2 }}>
              {todayTasks.filter(t => !t.completed).length} pending
            </div>
          </div>

          {/* Remaining Budget */}
          <div style={{
            background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)', cursor: 'pointer',
          }} onClick={() => setIsBudgetModalOpen(true)}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Budget Left
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: isOverBudget ? 'var(--color-danger)' : 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 2 }}>
              {monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Set Budget'}
            </div>
          </div>

          {/* Monthly Progress */}
          <div style={{
            background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Task Completion
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', marginTop: 2 }}>
              {taskCompletionPercent}% done
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 1 — EXPENSES AT A GLANCE
         ═══════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          icon={CreditCard}
          iconBg="var(--accent-muted)"
          iconColor="var(--accent)"
          title="Expense Tracker"
          subtitle="Log, categorize, and control your daily spending"
          actions={
            <>
              <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={13} strokeWidth={2.5} />
                Log Expense
              </button>
              <button onClick={() => setActivePage('expenses')} className="btn btn-secondary btn-sm">
                View All →
              </button>
            </>
          }
        />

        {/* Expenses List Card */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {filteredExp.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No expenses logged yet"
              description="Keep track of food, transport, books, and hostel expenses."
              actionLabel="Add First Expense"
              onAction={() => setIsQuickAddExpenseOpen(true)}
            />
          ) : (
            filteredExp.slice(0, 5).map((exp, i) => {
              const catColor = CATEGORY_COLORS[exp.category] || '#64748b';
              const catEmoji = CATEGORY_EMOJIS[exp.category] || '💡';
              return (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderBottom: i < Math.min(filteredExp.length, 5) - 1 ? '1px solid var(--border-subtle)' : 'none',
                    borderLeft: `3px solid ${catColor}`,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 'var(--radius-md)',
                      background: `${catColor}15`, border: `1px solid ${catColor}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', flexShrink: 0,
                    }}>
                      {catEmoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {exp.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>
                        {exp.category} · {exp.date}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <button onClick={() => deleteExpense(exp.id)} className="btn-icon" style={{ color: 'var(--color-danger)' }} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — TASKS AT A GLANCE
         ═══════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          icon={CheckSquare}
          iconBg="rgba(59,130,246,0.1)"
          iconColor="#3b82f6"
          title="Daily Tasks &amp; Goals"
          subtitle="Stay on top of assignments, lab submissions, and exams"
          actions={
            <>
              <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm">
                <Plus size={13} strokeWidth={2.5} />
                New Task
              </button>
              <button onClick={() => setActivePage('todos')} className="btn btn-secondary btn-sm">
                View All →
              </button>
            </>
          }
        />

        {/* Tasks List Card */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {filteredTodos.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks scheduled"
              description="Add your daily assignments or study goals."
              actionLabel="Create First Task"
              onAction={() => setIsTaskModalOpen(true)}
            />
          ) : (
            filteredTodos.slice(0, 5).map((todo, i) => {
              const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
              const pColor = priorityColors[todo.priority] || '#64748b';
              return (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderBottom: i < Math.min(filteredTodos.length, 5) - 1 ? '1px solid var(--border-subtle)' : 'none',
                    borderLeft: `3px solid ${pColor}`,
                    opacity: todo.completed ? 0.65 : 1,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodoCompleted(todo.id)}
                      style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem', fontWeight: 600,
                        color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {todo.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>
                        Due {todo.dueDate}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <PriorityBadge priority={todo.priority} />
                    <button onClick={() => deleteTodo(todo.id)} className="btn-icon" style={{ color: 'var(--color-danger)' }} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
};
