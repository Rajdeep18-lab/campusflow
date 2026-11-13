import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Receipt,
  CheckSquare,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CATEGORY_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

const CATEGORY_COLORS = {
  Food: '#C77726',
  Travel: '#4A7C59',
  Books: '#685B88',
  Hostel: '#B25D42',
  Mess: '#2F6B4F',
  Shopping: '#A85A75',
  Recharge: '#3C6E71',
  Entertainment: '#7D688D',
  Others: '#7A7568',
};

// Format date string to human-readable label
const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const CalendarView = () => {
  const {
    expenses,
    todos,
    monthlyBudget,
    setIsQuickAddExpenseOpen,
    setIsTaskModalOpen,
    toggleTodoCompleted,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const calendarCells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const pad = (n) => String(n).padStart(2, '0');

  // Per-day computed data
  const getDayData = (dateStr) => {
    const dayExp = expenses.filter((e) => e.date === dateStr);
    const dayTodos = todos.filter((t) => t.dueDate === dateStr);
    const total = dayExp.reduce((s, e) => s + e.amount, 0);
    return {
      expenses: dayExp,
      todos: dayTodos,
      total,
      completedTodos: dayTodos.filter((t) => t.completed).length,
      pendingTodos: dayTodos.filter((t) => !t.completed).length,
    };
  };

  // Warning threshold: daily spending > 10% of monthly budget (or ₹500 default)
  const dailyWarningThreshold = monthlyBudget > 0 ? monthlyBudget * 0.10 : 500;

  // Selected day data
  const selected = getDayData(selectedDateStr);

  // Month stats
  const monthStr = `${year}-${pad(month + 1)}`;
  const monthlyTotal = expenses
    .filter((e) => e.date && e.date.startsWith(monthStr))
    .reduce((s, e) => s + e.amount, 0);
  const monthlyTasksDue = todos.filter((t) => t.dueDate && t.dueDate.startsWith(monthStr)).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Calendar
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Visual overview of your daily expenses and schedule deadlines.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => {
              const t = new Date();
              setCurrentDate(t);
              setSelectedDateStr(t.toISOString().split('T')[0]);
            }}
            className="btn btn-secondary btn-sm"
          >
            <CalendarDays size={14} style={{ color: 'var(--accent)' }} />
            Today
          </button>
        </div>
      </div>

      {/* ── Month Summary Metric Strip ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'var(--accent-subtle)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Receipt size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {MONTH_NAMES[month]} Spending
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)', marginTop: 2 }}>
              ₹{monthlyTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'var(--accent-subtle)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tasks Due In {MONTH_NAMES[month]}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
              {monthlyTasksDue}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Calendar Grid + Selected Day Pane ── */}
      <div className="cal-layout-grid">
        {/* ── Left Column: Calendar Grid ── */}
        <div className="card" style={{ padding: '16px 14px' }}>
          {/* Controls Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {MONTH_NAMES[month]} {year}
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="btn-icon"
                aria-label="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="btn-icon"
                aria-label="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Table */}
          <div>
            {/* Day of week headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    padding: '4px 0',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar cells grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {calendarCells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} style={{ minHeight: 64 }} />;

                const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
                const dayData = getDayData(dateStr);
                const isSelected = dateStr === selectedDateStr;
                const isToday = dateStr === todayStr;
                const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const hasWarning = dayData.total > dailyWarningThreshold && dayData.total > 0;

                let cellClass = 'cal-cell';
                if (isSelected) cellClass += ' cal-cell--selected';
                else if (isToday) cellClass += ' cal-cell--today';
                else if (isWeekend) cellClass += ' cal-cell--weekend';

                return (
                  <div
                    key={dateStr}
                    className={cellClass}
                    onClick={() => setSelectedDateStr(dateStr)}
                    title={formatDateLabel(dateStr)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedDateStr(dateStr);
                    }}
                  >
                    {/* Day number */}
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected || isToday ? 700 : 500,
                      color: isSelected
                        ? 'var(--accent)'
                        : isToday
                        ? 'var(--accent)'
                        : 'var(--text-primary)',
                      lineHeight: 1,
                    }}>
                      {day}
                    </span>

                    {/* Expense amount */}
                    {dayData.total > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        color: hasWarning ? '#D97706' : 'var(--color-success)',
                        letterSpacing: '-0.02em',
                        marginTop: 3,
                        lineHeight: 1,
                      }}>
                        ₹{dayData.total >= 1000
                          ? `${(dayData.total / 1000).toFixed(1)}k`
                          : dayData.total.toLocaleString('en-IN')}
                      </span>
                    )}

                    {/* Task count */}
                    {dayData.todos.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: 700, lineHeight: 1 }}>
                          {dayData.todos.length}
                        </span>
                      </div>
                    )}

                    {/* Budget warning dot */}
                    {hasWarning && (
                      <div style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 5, height: 5, borderRadius: '50%',
                        background: '#D97706',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex', gap: 14, marginTop: 14, paddingTop: 12,
              borderTop: '1px solid var(--border-base)',
              fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600,
              letterSpacing: '0.03em', flexWrap: 'wrap',
            }}>
              {[
                { dot: 'var(--accent)', label: 'Today / Selected' },
                { dot: 'var(--color-success)', label: 'Expenses' },
                { dot: 'var(--accent)', label: 'Tasks Due' },
                { dot: '#D97706', label: 'High Spending' },
              ].map(({ dot, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Selected Day Pane ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Date header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-base)' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {selectedDateStr === todayStr ? '📅 Today' : formatDateLabel(selectedDateStr).split(',')[0]}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
              {formatDateLabel(selectedDateStr)}
            </div>

            {/* Day totals */}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <div style={{
                flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Spent</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em', marginTop: 2 }}>
                  {selected.total > 0 ? `₹${selected.total.toLocaleString('en-IN')}` : '₹0'}
                </div>
              </div>
              <div style={{
                flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tasks</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 2 }}>
                  {selected.todos.length}
                </div>
              </div>
            </div>
          </div>

          {/* Expenses section */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-base)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Receipt size={13} color="var(--accent)" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Expenses ({selected.expenses.length})
              </span>
            </div>

            {selected.expenses.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', textAlign: 'center' }}>
                <Receipt size={22} color="var(--text-muted)" strokeWidth={1.4} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No expenses on this date</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {selected.expenses.map((exp) => {
                  const catColor = CATEGORY_COLORS[exp.category] || 'var(--text-muted)';
                  const catEmoji = CATEGORY_EMOJIS[exp.category] || '💡';
                  return (
                    <div
                      key={exp.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `${catColor}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.875rem', flexShrink: 0,
                        }}>
                          {catEmoji}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {exp.title}
                          </div>
                          <div style={{ fontSize: '0.625rem', color: catColor, fontWeight: 600 }}>{exp.category}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-success)', flexShrink: 0 }}>
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tasks section */}
          <div style={{ padding: '14px 18px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckSquare size={13} color="var(--accent)" />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Tasks
                </span>
              </div>
              {selected.todos.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {selected.completedTodos > 0 && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircle2 size={11} /> {selected.completedTodos} done
                    </span>
                  )}
                  {selected.pendingTodos > 0 && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#D97706', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} /> {selected.pendingTodos} pending
                    </span>
                  )}
                </div>
              )}
            </div>

            {selected.todos.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', textAlign: 'center' }}>
                <CheckSquare size={22} color="var(--text-muted)" strokeWidth={1.4} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No tasks scheduled</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {selected.todos.map((todo) => {
                  const priorityColors = { High: '#DC2626', Medium: '#D97706', Low: 'var(--accent)' };
                  const pColor = priorityColors[todo.priority] || 'var(--text-muted)';
                  return (
                    <div
                      key={todo.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        borderLeft: `3px solid ${pColor}`,
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodoCompleted(todo.id)}
                          style={{ width: 14, height: 14, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                        />
                        <span style={{
                          fontSize: '0.8125rem', fontWeight: 600,
                          color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {todo.title}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.5625rem', fontWeight: 700, color: pColor,
                        background: `${pColor}15`, border: `1px solid ${pColor}30`,
                        padding: '2px 5px', borderRadius: 4, flexShrink: 0,
                      }}>
                        {todo.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions footer */}
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-base)', display: 'flex', gap: 8 }}>
            <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <Plus size={13} />
              Add Expense
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <Plus size={13} />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
