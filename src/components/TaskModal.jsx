import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRIORITIES = [
  { level: 'High',   color: '#B42318' },
  { level: 'Medium', color: '#A06A15' },
  { level: 'Low',    color: '#2E7D4F' },
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

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.dueDate || new Date().toISOString().split('T')[0]);
      setTag(editingTask.tag || '');
    } else {
      setTitle('');
      setPriority('Medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setTag('');
    }
    setError('');
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen && !editingTask) return null;

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    const payload = {
      title: title.trim(),
      priority,
      dueDate,
      tag: tag.trim(),
    };

    const success = editingTask
      ? editTodo(editingTask.id, payload)
      : addTodo(payload);

    if (success) handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Mobile grab handle (< 640px) */}
        <div className="modal-grab-handle block sm:hidden" />

        <div className="modal-header">
          <span className="modal-title">
            {editingTask ? 'Edit task' : 'Add task'}
          </span>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            {/* Task Title */}
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setError(''); }}
                placeholder="e.g. Revise Unit 3 for mid-sem"
                className="form-input form-input-modal"
                autoFocus
                required
              />
            </div>

            {/* Priority & Due Date (2 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PRIORITIES.map(p => {
                    const isSelected = priority === p.level;
                    return (
                      <button
                        key={p.level}
                        type="button"
                        onClick={() => setPriority(p.level)}
                        className={`chip${isSelected ? ' active' : ''}`}
                        style={{ flex: 1, justifyContent: 'center', height: 34 }}
                      >
                        <span
                          className="chip-color-dot"
                          style={{ background: isSelected ? '#FFFFFF' : p.color }}
                        />
                        <span>{p.level}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="form-input form-input-modal"
                  required
                />
              </div>
            </div>

            {/* Subject / Tag (e.g. Mathematics, Operating Systems, Personal) */}
            <div className="form-group">
              <label className="form-label">Subject / Tag (optional)</label>
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="e.g. Mathematics, Personal, Lab"
                className="form-input form-input-modal"
                maxLength={40}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary btn-modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-modal"
            >
              {editingTask ? 'Save task' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
