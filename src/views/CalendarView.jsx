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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const CATEGORY_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

const CATEGORY_COLORS = {
  Food: '#10b981', Travel: '#06b6d4', Books: '#3b82f6',
  Hostel: '#8b5cf6', Mess: '#ec4899', Shopping: '#f59e0b',
  Recharge: '#14b8a6', Entertainment: '#6366f1', Others: '#64748b',
};

// Format a date string to a readable label
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

  const [currentDate,     setCurrentDate]     = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const todayStr        = new Date().toISOString().split('T')[0];

  const calendarCells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const pad = n => String(n).padStart(2, '0');

  // Per-day computed data
  const getDayData = (dateStr) => {
    const dayExp   = expenses.filter(e => e.date === dateStr);
    const dayTodos = todos.filter(t => t.dueDate === dateStr);
    const total    = dayExp.reduce((s, e) => s + e.amount, 0);
    return {
      expenses: dayExp,
      todos: dayTodos,
      total,
      completedTodos: dayTodos.filter(t => t.completed).length,
      pendingTodos:   dayTodos.filter(t => !t.completed).length,
    };
  };

  // Budget warning threshold: if daily spending > 10% of monthly budget (or ₹500 if no budget)
  const dailyWarningThreshold = monthlyBudget > 0 ? monthlyBudget * 0.10 : 500;

  // Selected day data
  const selected = getDayData(selectedDateStr);

  // Monthly month stats for header
  const monthStr = `${year}-${pad(month + 1)}`;
  const monthlyTotal = expenses
    .filter(e => e.date && e.date.startsWith(monthStr))
    .reduce((s, e) => s + e.amount, 0);
  const monthlyTasksDue = todos.filter(t => t.dueDate && t.dueDate.startsWith(monthStr)).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Calendar
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Visual overview of your expenses and tasks by date.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => { const t = new Date(); setCurrentDate(t); setSelectedDateStr(t.toISOString().split('T')[0]); }}
            className="btn btn-secondary btn-sm"
          >
            <CalendarDays size={13} style={{ color: 'var(--accent)' }} />
            Today
          </button>
        </div>
      </div>

      {/* ── Month Summary Strip ── */}
      <div style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Month Spending', value: `₹${monthlyTotal.toLocaleString('en-IN')}`, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
          { label: 'Tasks Due This Month', value: monthlyTasksDue, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
          { label: 'Avg Daily Spend', value: daysInMonth > 0 ? `₹${Math.round(monthlyTotal / new Date(year, month + 1, 0).getDate()).toLocaleString('en-IN')}` : '₹0', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{
            flex: '1 1 140px',
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color, letterSpacing: '-0.025em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Calendar + Detail Pane ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="calendar-layout">

        {/* ── Calendar Card ── */}
        <div className="card">
          {/* Month navigation */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', borderBottom: '1px solid var(--border-base)',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {MONTH_NAMES[month]} {year}
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="btn-icon" title="Previous month">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="btn-icon" title="Next month">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div style={{ padding: '12px 14px 14px' }}>
            {/* Day of week headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
              {DAYS_OF_WEEK.map((d, i) => (
                <div key={d} style={{
                  textAlign: 'center',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: i === 0 || i === 6 ? 'rgba(139,92,246,0.7)' : 'var(--text-muted)',
                  padding: '3px 0',
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar cells grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              {calendarCells.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} style={{ minHeight: 68 }} />;

                const dateStr  = `${year}-${pad(month + 1)}-${pad(day)}`;
                const dayData  = getDayData(dateStr);
                const isSelected = dateStr === selectedDateStr;
                const isToday    = dateStr === todayStr;
                const dayOfWeek  = new Date(dateStr + 'T00:00:00').getDay();
                const isWeekend  = dayOfWeek === 0 || dayOfWeek === 6;
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
                  >
                    {/* Day number */}
                    <span style={{
                      fontSize: '0.8125rem',
                      fontWeight: isSelected || isToday ? 700 : isWeekend ? 600 : 500,
                      color: isSelected
                        ? 'var(--accent)'
                        : isToday
                        ? 'var(--accent)'
                        : isWeekend
                        ? 'rgba(139,92,246,0.85)'
                        : 'var(--text-secondary)',
                      lineHeight: 1,
                    }}>
                      {day}
                    </span>

                    {/* Expense amount */}
                    {dayData.total > 0 && (
                      <span style={{
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        color: hasWarning ? '#f59e0b' : 'var(--color-success)',
                        letterSpacing: '-0.02em',
                        marginTop: 2,
                        lineHeight: 1,
                      }}>
                        ₹{dayData.total >= 1000
                          ? `${(dayData.total / 1000).toFixed(1)}k`
                          : dayData.total.toLocaleString('en-IN')}
                      </span>
                    )}

                    {/* Task count + indicator */}
                    {dayData.todos.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 1 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.5rem', color: '#3b82f6', fontWeight: 700, lineHeight: 1 }}>
                          {dayData.todos.length}
                        </span>
                      </div>
                    )}

                    {/* Budget warning indicator */}
                    {hasWarning && (
                      <div style={{
                        position: 'absolute', top: 3, right: 3,
                        width: 5, height: 5, borderRadius: '50%',
                        background: '#f59e0b',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex', gap: 14, marginTop: 12, paddingTop: 10,
              borderTop: '1px solid var(--border-base)',
              fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600,
              letterSpacing: '0.03em', flexWrap: 'wrap',
            }}>
              {[
                { dot: 'var(--accent)', label: 'Today' },
                { dot: '#10b981', label: 'Expense amount' },
                { dot: '#3b82f6', label: 'Tasks due' },
                { dot: '#f59e0b', label: 'High spending' },
                { dot: 'rgba(139,92,246,0.7)', label: 'Weekend' },
              ].map(({ dot, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detail Pane ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Date header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-base)' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {selectedDateStr === todayStr ? '📅 Today' : formatDateLabel(selectedDateStr).split(',')[0]}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
              {formatDateLabel(selectedDateStr)}
            </div>

            {/* Day totals */}
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div style={{
                flex: 1, padding: '8px 10px', borderRadius: 'var(--radius-md)',
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Spent</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em', marginTop: 2 }}>
                  {selected.total > 0 ? `₹${selected.total.toLocaleString('en-IN')}` : '₹0'}
                </div>
              </div>
              <div style={{
                flex: 1, padding: '8px 10px', borderRadius: 'var(--radius-md)',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tasks</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.02em', marginTop: 2 }}>
                  {selected.todos.length}
                </div>
              </div>
            </div>
          </div>

          {/* Expense section */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-base)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Receipt size={12} color="var(--accent)" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Expenses ({selected.expenses.length})
              </span>
            </div>

            {selected.expenses.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '16px 0', textAlign: 'center',
              }}>
                <Receipt size={22} color="var(--text-muted)" strokeWidth={1.4} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No expenses on this date</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 180, overflowY: 'auto' }}>
                {selected.expenses.map(exp => {
                  const catColor = CATEGORY_COLORS[exp.category] || '#64748b';
                  const catEmoji = CATEGORY_EMOJIS[exp.category] || '💡';
                  return (
                    <div key={exp.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `${catColor}15`,
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
          <div style={{ padding: '12px 16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckSquare size={12} color="#3b82f6" />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Tasks
                </span>
              </div>
              {selected.todos.length > 0 && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {selected.completedTodos > 0 && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircle2 size={10} /> {selected.completedTodos} done
                    </span>
                  )}
                  {selected.pendingTodos > 0 && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} /> {selected.pendingTodos} pending
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 180, overflowY: 'auto' }}>
                {selected.todos.map(todo => {
                  const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
                  const pColor = priorityColors[todo.priority] || '#64748b';
                  return (
                    <div key={todo.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: `3px solid ${pColor}`,
                      gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodoCompleted(todo.id)}
                          style={{ width: 13, height: 13, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
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
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-base)', display: 'flex', gap: 8 }}>
            <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <Plus size={12} />
              Add Expense
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <Plus size={12} />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .calendar-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
