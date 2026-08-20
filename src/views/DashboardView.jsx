import React, { useState } from 'react';
import {
  CreditCard,
  CheckSquare,
  Plus,
  Trash2,
  TrendingUp,
  PiggyBank,
  Target,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

const CATEGORY_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

const CATEGORY_COLORS = {
  Food: '#F0A24B', Travel: '#6FB6E8', Books: '#8A7FE8',
  Hostel: '#E8875B', Mess: '#4FBF8B', Shopping: '#E86FA8',
  Recharge: '#5BCFE0', Entertainment: '#C98AE8', Others: '#9AA5B8',
};

/* ─── Priority Badge ─── */
const PriorityBadge = ({ priority }) => {
  const map = {
    High:   'badge badge-danger',
    Medium: 'badge badge-info',
    Low:    'badge badge-success',
  };
  return <span className={map[priority] || 'badge badge-neutral'}>{priority}</span>;
};

/* ─── Section Header ─── */
const SectionHeader = ({ icon: Icon, iconBg, iconColor, title, subtitle, actions }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36,
        height: 36,
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
          fontFamily: 'var(--font-heading)',
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
          marginTop: 2,
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

  const formattedDateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ═══════════════════════════════════════════════
          TODAY SNAPSHOT & GREETING HERO BANNER
         ═══════════════════════════════════════════════ */}
      <div className="today-snapshot">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                {getGreeting()}
              </h1>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Here is your daily snapshot for <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>{formattedDateStr}</span>.
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 20,
        }}>
          {/* Today's Expense */}
          <div style={{
            background: 'var(--bg-card)', padding: '14px 16px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Today's Spend
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em', marginTop: 2 }}>
                ₹{todayExpensesTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(52,199,123,0.12)', border: '1px solid rgba(52,199,123,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={18} color="var(--color-success)" />
            </div>
          </div>

          {/* Today's Tasks */}
          <div style={{
            background: 'var(--bg-card)', padding: '14px 16px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Today's Tasks
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '-0.02em', marginTop: 2 }}>
                {todayTasks.filter(t => !t.completed).length} <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>pending</span>
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(108,142,245,0.12)', border: '1px solid rgba(108,142,245,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={18} color="var(--accent-blue)" />
            </div>
          </div>

          {/* Remaining Budget */}
          <div style={{
            background: 'var(--bg-card)', padding: '14px 16px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            transition: 'all 0.15s',
          }} onClick={() => setIsBudgetModalOpen(true)}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Budget Left
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: isOverBudget ? 'var(--color-danger)' : 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 2 }}>
                {monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Set Budget'}
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(232,163,61,0.12)', border: '1px solid rgba(232,163,61,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PiggyBank size={18} color="var(--accent)" />
            </div>
          </div>

          {/* Task Progress */}
          <div style={{
            background: 'var(--bg-card)', padding: '14px 16px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Task Progress
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', marginTop: 2 }}>
                {taskCompletionPercent}% <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>done</span>
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(138,127,232,0.12)', border: '1px solid rgba(138,127,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={18} color="#8A7FE8" />
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
              const catColor = CATEGORY_COLORS[exp.category] || '#9AA5B8';
              const catEmoji = CATEGORY_EMOJIS[exp.category] || '💡';
              return (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: i < Math.min(filteredExp.length, 5) - 1 ? '1px solid var(--border-subtle)' : 'none',
                    borderLeft: `3px solid ${catColor}`,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-md)',
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
                        {exp.category} · <span style={{ fontFamily: 'var(--font-mono)' }}>{exp.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
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
          iconBg="rgba(108,142,245,0.12)"
          iconColor="var(--accent-blue)"
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
              const priorityColors = { High: 'var(--color-danger)', Medium: 'var(--accent-blue)', Low: 'var(--color-success)' };
              const pColor = priorityColors[todo.priority] || '#9AA5B8';
              return (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
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
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
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
                        Due <span style={{ fontFamily: 'var(--font-mono)' }}>{todo.dueDate}</span>
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
