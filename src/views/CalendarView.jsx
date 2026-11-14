import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const pad = (n) => String(n).padStart(2, '0');

  // Month grid cells
  const calendarCells = [
    ...Array(firstDayOfMonth).fill(null),
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
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1.25,
          }}>
            Calendar
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
            Deadlines and spending, day by day
          </p>
        </div>

        {/* Header Right: Legend + Month Nav + Today */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: 4,
                background: 'var(--accent-tint)',
                color: 'var(--accent)',
                fontWeight: 500,
              }}>
                Deadline
              </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A06A15' }} />
              <span>Spending</span>
            </span>
          </div>

          {/* Month switcher */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-control)',
            padding: '2px 6px',
          }}>
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="btn-icon"
              style={{ width: 26, height: 26 }}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', minWidth: 110, textAlign: 'center' }}>
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
          >
            Today
          </button>
        </div>
      </div>

      {/* ── Main Layout: Calendar Grid (Left) + 300px Day Details (Right) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: 20,
        alignItems: 'flex-start',
      }}
      className="cal-layout-grid"
      >
        {/* Left Column: Calendar Grid Card */}
        <div className="card" style={{ padding: '16px' }}>
          {/* Weekday headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {DAYS_OF_WEEK.map(d => (
              <div key={d} style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', padding: '4px 0' }}>
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
                    style={{
                      minHeight: 82,
                      border: '1px solid transparent',
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
                  style={{
                    minHeight: 82,
                    padding: '6px',
                    borderRadius: 'var(--radius-control)',
                    border: isSelected
                      ? '2px solid var(--accent-solid)'
                      : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    transition: 'all 0.1s ease',
                  }}
                >
                  {/* Top: Day number */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {isToday ? (
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--accent-solid)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: 1,
                      }}>
                        {day}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: isSelected ? 600 : 500,
                        color: 'var(--text)',
                        paddingLeft: 2,
                      }}>
                        {day}
                      </span>
                    )}

                    {/* Spending tag */}
                    {dayData.totalSpent > 0 && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#A06A15',
                        fontFeatureSettings: '"tnum" 1',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#A06A15' }} />
                        ₹{dayData.totalSpent >= 1000
                          ? `${(dayData.totalSpent / 1000).toFixed(1)}k`
                          : dayData.totalSpent}
                      </span>
                    )}
                  </div>

                  {/* Deadline chips */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    {dayData.todos.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          padding: '2px 4px',
                          borderRadius: 3,
                          background: 'var(--accent-tint)',
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
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', paddingLeft: 2 }}>
                        +{dayData.todos.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 300px Selected Day Details (Page 4 in PDF) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              {formatSelectedDateTitle(selectedDateStr)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
              {selectedDateStr === todayStr ? 'Today' : selectedDateStr}
            </div>
          </div>

          {/* Section: Spending */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>
              Spending
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text)',
              fontFeatureSettings: '"tnum" 1',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: 10,
            }}>
              ₹{selectedData.totalSpent.toLocaleString('en-IN')}
            </div>

            {selectedData.expenses.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                      {exp.title} · <span style={{ color: 'var(--text-muted)' }}>{exp.category}</span>
                    </span>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--text)',
                      fontFeatureSettings: '"tnum" 1',
                      flexShrink: 0,
                    }}>
                      ₹{Number(exp.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Due today */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>
              Due {selectedDateStr === todayStr ? 'today' : 'on this date'}
            </div>

            {selectedData.todos.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
                      fontSize: '13px',
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
                        accentColor: 'var(--accent-solid)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{
                      color: todo.completed ? 'var(--text-muted)' : 'var(--text)',
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
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 14,
            marginTop: 'auto',
          }}>
            <button
              onClick={() => setIsQuickAddExpenseOpen(true)}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '12px' }}
            >
              Add expense
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '12px' }}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
