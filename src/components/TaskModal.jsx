import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRIORITIES = [
  { level: 'High',   color: 'var(--color-danger)',  bg: 'var(--color-danger-bg)',  dot: 'var(--color-danger)'  },
  { level: 'Medium', color: '#D97706',               bg: 'rgba(217,119,6,0.1)',    dot: '#D97706'              },
  { level: 'Low',    color: 'var(--accent)',        bg: 'var(--accent-subtle)',    dot: 'var(--accent)'        },
];

export const TaskModal = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    addTodo,
    editTodo,
  } = useApp();

  const [title,    setTitle]    = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate,  setDueDate]  = useState(new Date().toISOString().split('T')[0]);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.dueDate || new Date().toISOString().split('T')[0]);
    } else {
      setTitle(''); setPriority('Medium');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen && !editingTask) return null;

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required'); return; }

    const success = editingTask
      ? editTodo(editingTask.id, { title, priority, dueDate })
      : addTodo({ title, priority, dueDate });

    if (success) handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 440 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--accent-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckSquare size={17} color="var(--accent)" strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h3>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Keep your goals organized and on track
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn-icon" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div className="form-error">{error}</div>}

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Finish lab report, Pay library fine..."
              className="form-input"
              style={{ fontSize: '0.875rem' }}
              autoFocus
              required
              maxLength={120}
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PRIORITIES.map(p => (
                <button
                  key={p.level}
                  type="button"
                  onClick={() => setPriority(p.level)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: `${priority === p.level ? 1.5 : 1}px solid ${priority === p.level ? p.color : 'var(--border-base)'}`,
                    background: priority === p.level ? p.bg : 'var(--bg-tertiary)',
                    color: priority === p.level ? p.color : 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    fontWeight: priority === p.level ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  <span style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: p.dot,
                    display: 'inline-block',
                    flexShrink: 0,
                  }} />
                  {p.level}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" onClick={handleClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm">
            {editingTask ? <Check size={13} /> : <Plus size={13} />}
            {editingTask ? 'Save Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
