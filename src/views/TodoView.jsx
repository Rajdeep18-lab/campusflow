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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

const PRIORITY_CONFIG = {
  High:   { color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'rgba(200,70,48,0.25)' },
  Medium: { color: 'var(--color-info)',   bg: 'var(--color-info-bg)',   border: 'rgba(60,110,113,0.25)' },
  Low:    { color: 'var(--accent)',       bg: 'var(--accent-muted)',    border: 'var(--accent-border)' },
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Task Manager
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Organize assignments, exams, labs, and personal study goals.
          </p>
        </div>
        <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
          <Plus size={14} strokeWidth={2.5} />
          Create Task
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Tasks', value: totalTasksCount, sub: 'All recorded', icon: ClipboardList, iconBg: 'var(--accent-muted)', iconColor: 'var(--accent)' },
          { label: 'Pending', value: pendingTasksCount, sub: 'Awaiting completion', icon: Clock, iconBg: 'rgba(60,110,113,0.12)', iconColor: 'var(--color-info)' },
          { label: 'Completed', value: completedTasksCount, sub: `${taskCompletionPercent}% done`, icon: CheckCircle2, iconBg: 'var(--accent-muted)', iconColor: 'var(--accent)' },
          { label: 'Overdue', value: overdueCnt, sub: overdueCnt > 0 ? 'Needs immediate attention' : 'All clear 🎉', icon: AlertTriangle, iconBg: 'var(--color-danger-bg)', iconColor: 'var(--color-danger)' },
        ].map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="stat-label">{label}</span>
              <div className="stat-icon-box" style={{ background: iconBg }}>
                <Icon size={16} color={iconColor} strokeWidth={2} />
              </div>
            </div>
            <div className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Completion progress */}
      {totalTasksCount > 0 && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Overall Task Completion</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: taskCompletionPercent >= 80 ? 'var(--accent)' : 'var(--text-primary)' }}>
              {completedTasksCount} / {totalTasksCount} ({taskCompletionPercent}%)
            </span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div
              className="progress-fill"
              style={{
                width: `${taskCompletionPercent}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Tabs */}
          <div className="tab-group" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[
              { id: 'all',       label: `All (${totalTasksCount})` },
              { id: 'pending',   label: `Pending (${pendingTasksCount})` },
              { id: 'today',     label: `Today (${todos.filter(t => t.dueDate === todayStr).length})` },
              { id: 'overdue',   label: `Overdue (${overdueCnt})` },
              { id: 'completed', label: `Completed (${completedTasksCount})` },
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
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-danger)',
                    position: 'absolute',
                    top: 4,
                    right: 4,
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Search + Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search tasks by title or due date..."
                className="form-input"
                style={{ paddingLeft: 34, height: 38, width: '100%', fontSize: '0.8125rem' }}
              />
            </div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="form-select"
              style={{ height: 38, width: 'auto', fontSize: '0.8125rem', paddingRight: 28, flexShrink: 0 }}
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🔵 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
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
            activeTab === 'completed' ? 'No completed tasks yet' :
            activeTab === 'overdue' ? 'No overdue tasks 🎉' :
            'No matching tasks'
          }
          description={
            todos.length === 0
              ? 'Create your first task to stay organized and ahead of deadlines.'
              : activeTab === 'overdue'
              ? 'Great job — you have completed all pending deadlines!'
              : 'Try switching tabs or adjusting search filters.'
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
                  padding: '14px 18px',
                  borderBottom: i < filteredTodos.length - 1 ? '1px solid var(--border-base)' : 'none',
                  borderLeftColor: pc.color,
                  opacity: todo.completed ? 0.65 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                {/* Custom animated checkbox with touch target */}
                <button
                  onClick={() => toggleTodoCompleted(todo.id)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${todo.completed ? 'var(--accent)' : pc.color}`,
                    background: todo.completed ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
                    padding: 0,
                  }}
                  title={todo.completed ? 'Mark as pending' : 'Mark as done'}
                >
                  {todo.completed && (
                    <svg width="12" height="10" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: todo.completed ? 'var(--text-muted)' : overdue ? 'var(--color-danger)' : 'var(--text-primary)',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: 0,
                      flex: '1 1 auto',
                    }}>
                      {todo.title}
                    </span>
                    {/* Priority badge */}
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: pc.color,
                      background: pc.bg,
                      border: `1px solid ${pc.border}`,
                      padding: '2px 8px',
                      borderRadius: 20,
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}>
                      {todo.priority}
                    </span>
                    {/* Due date label (overdue / today) */}
                    {dlLabel && (
                      <span className={`badge ${dlLabel.cls}`} style={{ fontSize: '0.625rem', padding: '2px 8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {dlLabel.text}
                      </span>
                    )}
                  </div>
                  {/* Due date */}
                  <div style={{
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.72rem',
                    color: overdue ? 'var(--color-danger)' : 'var(--text-muted)',
                    fontWeight: overdue ? 600 : 400,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <CalendarDays size={12} />
                    <span>Due {formatDate(todo.dueDate)}</span>
                    {todo.completed && (
                      <span style={{ marginLeft: 6, color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 2, flexShrink: 0, alignItems: 'center' }}>
                  <button
                    onClick={() => setEditingTask(todo)}
                    className="btn-icon"
                    style={{ color: 'var(--accent)', minWidth: 34, minHeight: 34 }}
                    title="Edit task"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn-icon"
                    style={{ color: 'var(--color-danger)', minWidth: 34, minHeight: 34 }}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
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
