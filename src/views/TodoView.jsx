import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Trash2,
  Edit3,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardList,
  AlertTriangle,
  Circle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

const PRIORITY_CONFIG = {
  High:   { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)'  },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)' },
  Low:    { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const TodoView = () => {
  const {
    todos,
    toggleTodoCompleted,
    deleteTodo,
    setEditingTask,
    setIsTaskModalOpen,
    pendingTasksCount,
    completedTasksCount,
    totalTasksCount,
    taskCompletionPercent,
  } = useApp();

  const [activeTab,      setActiveTab]      = useState('all');
  const [searchTerm,     setSearchTerm]     = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];

  const isOverdue = (todo) =>
    !todo.completed && todo.dueDate && todo.dueDate < todayStr;

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'today'     && todo.dueDate !== todayStr) return false;
    if (activeTab === 'pending'   && todo.completed)            return false;
    if (activeTab === 'completed' && !todo.completed)           return false;
    if (activeTab === 'overdue'   && !isOverdue(todo))          return false;
    if (priorityFilter !== 'All'  && todo.priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return todo.title.toLowerCase().includes(q) ||
             todo.priority.toLowerCase().includes(q) ||
             (todo.dueDate && todo.dueDate.includes(q));
    }
    return true;
  });

  const overdueCnt = todos.filter(t => isOverdue(t)).length;

  const getDueDateLabel = (todo) => {
    if (todo.completed) return null;
    if (!todo.dueDate) return null;
    if (todo.dueDate < todayStr) return { text: 'Overdue', cls: 'badge badge-overdue' };
    if (todo.dueDate === todayStr) return { text: 'Due Today', cls: 'badge badge-today' };
    return null;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Task Manager
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Organize assignments, exams, labs, and personal goals.
          </p>
        </div>
        <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
          <Plus size={13} strokeWidth={2.5} />
          Create Task
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
        {[
          { label: 'Total Tasks', value: totalTasksCount, sub: 'All time', icon: ClipboardList, iconBg: 'rgba(20,184,166,0.1)', iconColor: '#14b8a6' },
          { label: 'Pending', value: pendingTasksCount, sub: 'To complete', icon: Clock, iconBg: 'rgba(245,158,11,0.1)', iconColor: '#f59e0b' },
          { label: 'Completed', value: completedTasksCount, sub: `${taskCompletionPercent}% done`, icon: CheckCircle2, iconBg: 'rgba(16,185,129,0.1)', iconColor: 'var(--color-success)' },
          { label: 'Overdue', value: overdueCnt, sub: overdueCnt > 0 ? 'Needs attention!' : 'All good 🎉', icon: AlertTriangle, iconBg: 'rgba(239,68,68,0.1)', iconColor: 'var(--color-danger)' },
        ].map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">{label}</span>
              <div className="stat-icon-box" style={{ background: iconBg }}>
                <Icon size={16} color={iconColor} strokeWidth={2} />
              </div>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Completion progress */}
      {totalTasksCount > 0 && (
        <div className="card" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Completion Progress</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: taskCompletionPercent >= 80 ? 'var(--color-success)' : 'var(--text-primary)' }}>
              {completedTasksCount} / {totalTasksCount}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${taskCompletionPercent}%`,
              background: 'linear-gradient(90deg, #10b981, #059669)',
              transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="card" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div className="tab-group">
            {[
              { id: 'all',       label: `All (${totalTasksCount})` },
              { id: 'pending',   label: `Pending (${pendingTasksCount})` },
              { id: 'today',     label: `Today (${todos.filter(t => t.dueDate === todayStr).length})` },
              { id: 'overdue',   label: `Overdue (${overdueCnt})` },
              { id: 'completed', label: `Done (${completedTasksCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
                style={{ position: 'relative' }}
              >
                {tab.label}
                {tab.id === 'overdue' && overdueCnt > 0 && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#ef4444',
                    position: 'absolute', top: 3, right: 3,
                  }} />
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="form-input"
                style={{ paddingLeft: 30, height: 34, width: 160, fontSize: '0.8125rem' }}
              />
            </div>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="form-select" style={{ height: 34, width: 'auto', fontSize: '0.8125rem', paddingRight: 28 }}>
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Task List ── */}
      {filteredTodos.length === 0 ? (
        <EmptyState
          icon={activeTab === 'completed' ? CheckCircle2 : CheckSquare}
          title={
            todos.length === 0 ? 'No tasks yet' :
            activeTab === 'completed' ? 'No completed tasks' :
            activeTab === 'overdue' ? 'No overdue tasks 🎉' :
            'No matching tasks'
          }
          description={
            todos.length === 0
              ? 'Create your first task to stay organized and ahead of deadlines.'
              : activeTab === 'overdue'
              ? 'Great job — you have no overdue tasks!'
              : 'Try switching tabs or adjusting filters.'
          }
          actionLabel={todos.length === 0 ? 'Create First Task' : undefined}
          onAction={todos.length === 0 ? () => setIsTaskModalOpen(true) : undefined}
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {filteredTodos.map((todo, i) => {
            const pc      = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.Low;
            const overdue = isOverdue(todo);
            const dlLabel = getDueDateLabel(todo);

            return (
              <div
                key={todo.id}
                className="task-card"
                style={{
                  borderBottom: i < filteredTodos.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  borderLeftColor: pc.color,
                  opacity: todo.completed ? 0.7 : 1,
                }}
              >
                {/* Custom animated checkbox */}
                <button
                  onClick={() => toggleTodoCompleted(todo.id)}
                  style={{
                    width: 20, height: 20,
                    borderRadius: 6,
                    border: `2px solid ${todo.completed ? 'var(--accent)' : pc.color}`,
                    background: todo.completed ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
                    padding: 0,
                  }}
                  title={todo.completed ? 'Mark as pending' : 'Mark as done'}
                >
                  {todo.completed && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.9rem', fontWeight: 600, letterSpacing: '-0.01em',
                      color: todo.completed ? 'var(--text-muted)' : overdue ? 'var(--color-danger)' : 'var(--text-primary)',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      maxWidth: 340,
                    }}>
                      {todo.title}
                    </span>
                    {/* Priority badge */}
                    <span style={{
                      fontSize: '0.5625rem', fontWeight: 700, color: pc.color,
                      background: pc.bg, border: `1px solid ${pc.border}`,
                      padding: '2px 6px', borderRadius: 20, flexShrink: 0,
                    }}>
                      {todo.priority}
                    </span>
                    {/* Due date label (overdue / today) */}
                    {dlLabel && (
                      <span className={`badge ${dlLabel.cls}`} style={{ fontSize: '0.5625rem', padding: '2px 6px', flexShrink: 0 }}>
                        {dlLabel.text}
                      </span>
                    )}
                  </div>
                  {/* Due date */}
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: overdue ? '#ef4444' : 'var(--text-muted)', fontWeight: overdue ? 600 : 400 }}>
                    <CalendarDays size={11} />
                    <span>Due {formatDate(todo.dueDate)}</span>
                    {todo.completed && (
                      <span style={{ marginLeft: 4, color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <CheckCircle2 size={10} /> Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  <button onClick={() => setEditingTask(todo)} className="btn-icon" style={{ color: '#14b8a6' }} title="Edit task">
                    <Edit3 size={13} />
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} className="btn-icon" style={{ color: 'var(--color-danger)' }} title="Delete task">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
