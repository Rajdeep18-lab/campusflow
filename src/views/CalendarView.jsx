import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryColor } from '../utils/categoryColors';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const CalendarView = () => {
  const {
    expenses,
    todos,
    setIsQuickAddExpenseOpen,
    setIsTaskModalOpen,
    toggleTodoCompleted,
    formatCurrency,
    preferences,
    customCategories,
    profile,
  } = useApp();

  const isMondayFirst = preferences?.firstDayOfWeek !== 'Sunday';
  const DAYS_OF_WEEK = isMondayFirst
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Day offset calculation based on firstDayOfWeek
  let firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  if (isMondayFirst) {
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const pad = (n) => String(n).padStart(2, '0');

  // Month grid cells
  const calendarCells = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Per-day computed data
  const getDayData = (dateStr) => {
    const dayExp = expenses.filter(e => e.date === dateStr);
    const dayTodos = todos.filter(t => t.dueDate === dateStr);
    const totalSpent = dayExp.reduce((s, e) => s + Number(e.amount || 0), 0);
    return {
      expenses: dayExp,
      todos: dayTodos,
      totalSpent,
    };
  };

  const selectedData = getDayData(selectedDateStr);

  const formatSelectedDateTitle = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            margin: 0,
          }}>
            Calendar
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>
            Deadlines and spending mapped across the month
          </p>
        </div>

        {/* Legend + Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }} />
              <span>Deadline</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A06A15' }} />
              <span>Spending</span>
            </div>
          </div>

          {/* Month switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="btn-icon"
              style={{ width: 26, height: 26 }}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 110, textAlign: 'center' }}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="btn-icon"
              style={{ width: 26, height: 26 }}
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Today button */}
          <button
            onClick={() => {
              const t = new Date();
              setCurrentDate(t);
              setSelectedDateStr(t.toISOString().split('T')[0]);
            }}
            className="btn btn-secondary"
            style={{ height: 32, padding: '0 12px', fontSize: '0.75rem' }}
          >
            Today
          </button>
        </div>
      </div>

      {/* ── Main Layout: Calendar Grid (Left) + 300px Day Details (Right) ── */}
      <div className="cal-layout-grid">
        {/* Left Column: Calendar Grid Card */}
        <div className="card" style={{ padding: '16px', minWidth: 0, overflow: 'hidden' }}>
          {/* Weekday headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {DAYS_OF_WEEK.map(d => (
              <div key={d} style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cell matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
          }}>
            {calendarCells.map((day, idx) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="cal-day-cell"
                    style={{
                      border: '1px solid transparent',
                      background: 'transparent',
                      cursor: 'default',
                    }}
                  />
                );
              }

              const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
              const dayData = getDayData(dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className="cal-day-cell"
                  style={{
                    border: isSelected
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border)',
                    background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                  }}
                >
                  {/* Top: Day number */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    {isToday ? (
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}>
                        {day}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 600 : 500,
                        color: 'var(--text-primary)',
                        paddingLeft: 2,
                        flexShrink: 0,
                      }}>
                        {day}
                      </span>
                    )}

                    {/* Desktop Spending tag */}
                    {dayData.totalSpent > 0 && (
                      <span className="desktop-only-flex" style={{
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: '#A06A15',
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#A06A15' }} />
                        <span className="num">{formatCurrency(dayData.totalSpent)}</span>
                      </span>
                    )}
                  </div>

                  {/* Desktop Deadline chips */}
                  <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    {dayData.todos.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 500,
                          padding: '2px 4px',
                          borderRadius: 3,
                          background: 'var(--accent-subtle)',
                          color: 'var(--accent)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.2,
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayData.todos.length > 2 && (
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', paddingLeft: 2 }}>
                        +{dayData.todos.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Mobile Indicator Dots */}
                  <div className="mobile-only-flex" style={{ alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 'auto' }}>
                    {dayData.totalSpent > 0 && (
                      <span
                        style={{ width: 5, height: 5, borderRadius: '50%', background: '#A06A15', flexShrink: 0 }}
                        title={`Spent ${formatCurrency(dayData.totalSpent)}`}
                      />
                    )}
                    {dayData.todos.length > 0 && (
                      <span
                        style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}
                        title={`${dayData.todos.length} deadline(s)`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 300px Selected Day Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {formatSelectedDateTitle(selectedDateStr)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              {selectedDateStr === todayStr ? 'Today' : selectedDateStr}
            </div>
          </div>

          {/* Section: Spending */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Spending
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 10,
            }} className="num">
              {formatCurrency(selectedData.totalSpent)}
            </div>

            {selectedData.expenses.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No expenses recorded for this date.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedData.expenses.map(exp => (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                      {exp.title} · <span style={{ color: 'var(--text-secondary)' }}>{exp.category}</span>
                    </span>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      flexShrink: 0,
                    }} className="num">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Due today */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Due {selectedDateStr === todayStr ? 'today' : 'on this date'}
            </div>

            {selectedData.todos.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No deadlines scheduled.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedData.todos.map(todo => (
                  <div
                    key={todo.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.8125rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodoCompleted(todo.id)}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 3,
                        cursor: 'pointer',
                        accentColor: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{
                      color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {todo.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 8,
            borderTop: '1px solid var(--border)',
            paddingTop: 14,
            marginTop: 'auto',
          }}>
            <button
              onClick={() => setIsQuickAddExpenseOpen(true)}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              Add expense
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
