import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TodoView = () => {
  const {
    todos,
    setIsTaskModalOpen,
    setEditingTask,
    toggleTodoCompleted,
    deleteTodo,
  } = useApp();

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filters
  const [activeSegment, setActiveSegment] = useState('all'); // 'all' | 'pending' | 'today' | 'overdue' | 'done'
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'High' | 'Medium' | 'Low'

  // Counts
  const totalCount = todos.length;
  const pendingList = todos.filter(t => !t.completed);
  const doneList = todos.filter(t => t.completed);
  const todayList = todos.filter(t => t.dueDate === todayStr);
  const overdueList = todos.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);

  const pendingCount = pendingList.length;
  const doneCount = doneList.length;
  const todayCount = todayList.length;
  const overdueCount = overdueList.length;

  const highCount = pendingList.filter(t => t.priority === 'High').length;
  const mediumCount = pendingList.filter(t => t.priority === 'Medium').length;
  const lowCount = pendingList.filter(t => t.priority === 'Low').length;

  // Filtered tasks
  const filtered = useMemo(() => {
    return todos.filter(t => {
      // Segment filter
      if (activeSegment === 'pending' && t.completed) return false;
      if (activeSegment === 'done' && !t.completed) return false;
      if (activeSegment === 'today' && t.dueDate !== todayStr) return false;
      if (activeSegment === 'overdue' && (t.completed || !t.dueDate || t.dueDate >= todayStr)) return false;

      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = (t.title || '').toLowerCase().includes(q);
        const matchesTag = (t.tag || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesTag) return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

      return true;
    });
  }, [todos, activeSegment, searchTerm, priorityFilter, todayStr]);

  // Group into Today, Tomorrow, Later, Completed
  const groupedTasks = useMemo(() => {
    const groups = {
      today: [],
      tomorrow: [],
      later: [],
      completed: [],
    };

    filtered.forEach(t => {
      if (t.completed) {
        groups.completed.push(t);
      } else if (t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr)) {
        groups.today.push(t);
      } else if (t.dueDate === tomorrowStr) {
        groups.tomorrow.push(t);
      } else {
        groups.later.push(t);
      }
    });

    return groups;
  }, [filtered, todayStr, tomorrowStr]);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr === todayStr) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getPriorityInfo = (p) => {
    if (p === 'High') return { dot: '#B42318', label: 'High' };
    if (p === 'Medium') return { dot: '#A06A15', label: 'Medium' };
    return { dot: '#2E7D4F', label: 'Low' };
  };

  const completionPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const renderTaskRow = (todo) => {
    const pInfo = getPriorityInfo(todo.priority);
    return (
      <div
        key={todo.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Main row: Checkbox + Title + Edit/Delete Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
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

          {/* Actions */}
          <div style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => setEditingTask(todo)}
              className="btn-icon"
              style={{ width: 26, height: 26 }}
              title="Edit"
            >
              <Pencil size={12} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="btn-icon"
              style={{ width: 26, height: 26 }}
              title="Delete"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Trash2 size={12} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Metadata row: Tag, Date, Priority */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 26, flexWrap: 'wrap' }}>
          {/* Subject tag pill if present */}
          {todo.tag && (
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}>
              {todo.tag}
            </span>
          )}

          {/* Date */}
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {formatDateLabel(todo.dueDate)}
          </span>

          {/* Priority */}
          {!todo.completed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '11px',
              color: pInfo.dot,
              fontWeight: 500,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: pInfo.dot }} />
              <span>{pInfo.label}</span>
            </div>
          )}
        </div>
      </div>
    );
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
            Tasks
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
            {pendingCount} pending, {doneCount} completed
          </p>
        </div>

        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={14} strokeWidth={2} />
          <span>Add task</span>
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Segmented control */}
        <div className="segmented-control" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          {[
            { id: 'all',     label: 'All',     count: totalCount },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'today',   label: 'Today',   count: todayCount },
            { id: 'overdue', label: 'Overdue', count: overdueCount },
            { id: 'done',    label: 'Done',    count: doneCount },
          ].map(seg => (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id)}
              className={`segment-btn${activeSegment === seg.id ? ' active' : ''}`}
            >
              <span>{seg.label}</span>
              <span className="segment-count">{seg.count}</span>
            </button>
          ))}
        </div>

        {/* Search & Priority filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 200 }}>
            <Search
              size={14}
              color="var(--text-muted)"
              strokeWidth={1.75}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks"
              className="form-input"
              style={{ paddingLeft: 30, height: 34, fontSize: '13px' }}
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-input"
            style={{ height: 34, padding: '0 8px', fontSize: '12px', width: 'auto', cursor: 'pointer' }}
          >
            <option value="all">Priority: Any</option>
            <option value="High">Priority: High</option>
            <option value="Medium">Priority: Medium</option>
            <option value="Low">Priority: Low</option>
          </select>
        </div>
      </div>

      {/* ── Main Layout: Task List (Left) + 300px Panel (Right) ── */}
      <div className="tasks-layout-grid">
        {/* Left Column: Grouped Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No tasks found for this view.
            </div>
          ) : (
            <>
              {/* Today Section */}
              {groupedTasks.today.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, paddingLeft: 2 }}>
                    Today <span style={{ color: 'var(--text-disabled)' }}>{groupedTasks.today.length}</span>
                  </div>
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {groupedTasks.today.map(renderTaskRow)}
                  </div>
                </div>
              )}

              {/* Tomorrow Section */}
              {groupedTasks.tomorrow.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, paddingLeft: 2 }}>
                    Tomorrow <span style={{ color: 'var(--text-disabled)' }}>{groupedTasks.tomorrow.length}</span>
                  </div>
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {groupedTasks.tomorrow.map(renderTaskRow)}
                  </div>
                </div>
              )}

              {/* Later Section */}
              {groupedTasks.later.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, paddingLeft: 2 }}>
                    Later <span style={{ color: 'var(--text-disabled)' }}>{groupedTasks.later.length}</span>
                  </div>
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {groupedTasks.later.map(renderTaskRow)}
                  </div>
                </div>
              )}

              {/* Completed Section */}
              {groupedTasks.completed.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, paddingLeft: 2 }}>
                    Completed <span style={{ color: 'var(--text-disabled)' }}>{groupedTasks.completed.length}</span>
                  </div>
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {groupedTasks.completed.map(renderTaskRow)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: 300px Panel (Page 3 in PDF) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Card: Completion */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>
              Completion
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                {doneCount} of {totalCount}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                done
              </span>
            </div>

            {/* 4px green progress bar */}
            <div style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'var(--surface-2)',
              marginTop: 12,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 2,
                width: `${completionPct}%`,
                background: 'var(--accent-solid)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Card: Pending by priority */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>
              Pending by priority
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'High',   count: highCount,   dot: '#B42318' },
                { label: 'Medium', count: mediumCount, dot: '#A06A15' },
                { label: 'Low',    count: lowCount,    dot: '#2E7D4F' },
              ].map(({ label, count, dot }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--text)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
                    <span>{label}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
