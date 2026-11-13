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
  ArrowRight,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

const CATEGORY_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

const CATEGORY_COLORS = {
  Food: '#C77726', Travel: '#4A7C59', Books: '#685B88',
  Hostel: '#B25D42', Mess: '#2F6B4F', Shopping: '#A85A75',
  Recharge: '#3C6E71', Entertainment: '#7D688D', Others: '#7A7568',
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
const SectionHeader = ({ icon: Icon, title, subtitle, actions }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 16,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-muted)',
        border: '1px solid var(--accent-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color="var(--accent)" strokeWidth={2.2} />
      </div>
      <div>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: 2,
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
    budgetUsagePercent,
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

  const todayStr = new Date().toISOString().split('T')[0];
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

  const formattedDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ═══════════════════════════════════════════════
          HERO SNAPSHOT & GREETING BANNER
         ═══════════════════════════════════════════════ */}
      <div className="today-snapshot">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}>
                {getGreeting()}
              </h1>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Today is <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>{formattedDateStr}</span>. Here is your campus overview.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={14} strokeWidth={2.5} />
              Add Expense
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm">
              <Plus size={14} strokeWidth={2.5} />
              Add Task
            </button>
          </div>
        </div>

        {/* 4 Key Snapshot Metric Chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 20,
        }}>
          {/* Today's Expense */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            boxShadow: 'var(--shadow-xs)',
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Today's Spend
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', marginTop: 2 }}>
                ₹{todayExpensesTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TrendingUp size={18} color="var(--accent)" />
            </div>
          </div>

          {/* Today's Tasks */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            boxShadow: 'var(--shadow-xs)',
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Today's Tasks
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 2 }}>
                {todayTasks.filter(t => !t.completed).length} <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>pending</span>
              </div>
            </div>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(60, 110, 113, 0.12)',
              border: '1px solid rgba(60, 110, 113, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Clock size={18} color="var(--color-info)" />
            </div>
          </div>

          {/* Remaining Budget */}
          <div
            onClick={() => setIsBudgetModalOpen(true)}
            style={{
              background: 'var(--bg-card)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-base)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              boxShadow: 'var(--shadow-xs)',
              transition: 'border-color 0.15s',
            }}
            title="Click to adjust monthly budget"
          >
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Budget Left
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: isOverBudget ? 'var(--color-danger)' : 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginTop: 2,
              }}>
                {monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Set Budget'}
              </div>
            </div>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: isOverBudget ? 'var(--color-danger-bg)' : 'var(--accent-muted)',
              border: `1px solid ${isOverBudget ? 'rgba(200, 70, 48, 0.3)' : 'var(--accent-border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <PiggyBank size={18} color={isOverBudget ? 'var(--color-danger)' : 'var(--accent)'} />
            </div>
          </div>

          {/* Task Progress */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            boxShadow: 'var(--shadow-xs)',
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Task Progress
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', marginTop: 2 }}>
                {taskCompletionPercent}% <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>done</span>
              </div>
            </div>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Target size={18} color="var(--accent)" />
            </div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        {monthlyBudget > 0 && (
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Monthly Budget Utilization: <strong style={{ color: 'var(--text-primary)' }}>{budgetUsagePercent}%</strong>
              </span>
              {isOverBudget && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={13} /> Over Budget
                </span>
              )}
            </div>
            <div className="progress-track" style={{ height: 8 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(budgetUsagePercent, 100)}%`,
                  background: isOverBudget ? 'var(--color-danger)' : 'var(--accent)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 1 — RECENT EXPENSES
         ═══════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          icon={CreditCard}
          title="Recent Expenses"
          subtitle="Keep tabs on daily college expenditure"
          actions={
            <>
              <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={13} strokeWidth={2.5} />
                Log Expense
              </button>
              <button onClick={() => setActivePage('expenses')} className="btn btn-secondary btn-sm">
                View All <ArrowRight size={13} />
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
              description="Keep track of food, transport, books, hostel rent and more."
              actionLabel="Add First Expense"
              onAction={() => setIsQuickAddExpenseOpen(true)}
            />
          ) : (
            filteredExp.slice(0, 5).map((exp, i) => {
              const catColor = CATEGORY_COLORS[exp.category] || '#7A7568';
              const catEmoji = CATEGORY_EMOJIS[exp.category] || '💡';
              return (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: i < Math.min(filteredExp.length, 5) - 1 ? '1px solid var(--border-base)' : 'none',
                    borderLeft: `3px solid ${catColor}`,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.05rem',
                      flexShrink: 0,
                    }}>
                      {catEmoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {exp.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        <span style={{ fontWeight: 600, color: catColor }}>{exp.category}</span> · <span style={{ fontFamily: 'var(--font-mono)' }}>{exp.date}</span>
                        {exp.notes && ` · ${exp.notes}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      letterSpacing: '-0.02em',
                    }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="btn-icon"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — ACTIVE TASKS
         ═══════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          icon={CheckSquare}
          title="Daily Tasks &amp; Deadlines"
          subtitle="Stay on track with assignments, exams, and projects"
          actions={
            <>
              <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm">
                <Plus size={13} strokeWidth={2.5} />
                New Task
              </button>
              <button onClick={() => setActivePage('todos')} className="btn btn-secondary btn-sm">
                View All <ArrowRight size={13} />
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
              description="Add your study assignments or project milestones."
              actionLabel="Create First Task"
              onAction={() => setIsTaskModalOpen(true)}
            />
          ) : (
            filteredTodos.slice(0, 5).map((todo, i) => {
              const priorityColors = {
                High: 'var(--color-danger)',
                Medium: 'var(--color-info)',
                Low: 'var(--color-success)',
              };
              const pColor = priorityColors[todo.priority] || 'var(--text-muted)';
              return (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: i < Math.min(filteredTodos.length, 5) - 1 ? '1px solid var(--border-base)' : 'none',
                    borderLeft: `3px solid ${pColor}`,
                    opacity: todo.completed ? 0.6 : 1,
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
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: 'var(--accent)',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {todo.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarDays size={12} /> Due <span style={{ fontFamily: 'var(--font-mono)' }}>{todo.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <PriorityBadge priority={todo.priority} />
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn-icon"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Delete task"
                    >
                      <Trash2 size={14} />
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
