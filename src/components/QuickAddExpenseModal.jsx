import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, getCategoryColor } from '../utils/categoryColors';

export const QuickAddExpenseModal = () => {
  const {
    isQuickAddExpenseOpen,
    setIsQuickAddExpenseOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    editExpense,
    profile,
  } = useApp();

  const isDark = profile?.theme === 'dark';
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
      setCategory(editingExpense.category || 'Food');
      setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError('');
  }, [editingExpense, isQuickAddExpenseOpen]);

  if (!isQuickAddExpenseOpen && !editingExpense) return null;

  const handleClose = () => {
    setIsQuickAddExpenseOpen(false);
    setEditingExpense(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title for the expense.');
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Enter an amount above 0.');
      return;
    }

    const payload = {
      title: title.trim(),
      amount: parsed,
      category,
      date,
      notes: notes.trim(),
    };

    const success = editingExpense
      ? editExpense(editingExpense.id, payload)
      : addExpense(payload);

    if (success) handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Mobile grab handle (< 640px) */}
        <div className="modal-grab-handle block sm:hidden" />

        {/* Modal Header */}
        <div className="modal-header">
          <span className="modal-title">
            {editingExpense ? 'Edit expense' : 'Add expense'}
          </span>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                placeholder="e.g. Canteen lunch"
                className="form-input form-input-modal"
                required
                autoFocus
              />
            </div>

            {/* Amount & Date (2 columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                  }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(''); }}
                    placeholder="0"
                    className={`form-input form-input-modal${error ? ' error' : ''}`}
                    style={{ paddingLeft: 26, fontFeatureSettings: '"tnum" 1' }}
                    required
                  />
                </div>
                {error && (
                  <div className="form-error" style={{ marginTop: 2 }}>
                    {error}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input form-input-modal"
                  required
                />
              </div>
            </div>

            {/* Category Selector with 8px colored squares */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 2,
              }}>
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat.id;
                  const dotColor = getCategoryColor(cat.id, isDark ? 'dark' : 'light');
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`chip${isSelected ? ' active' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <span
                        className="chip-color-dot"
                        style={{ background: isSelected ? '#FFFFFF' : dotColor }}
                      />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note"
                className="form-input form-input-modal"
                maxLength={100}
              />
            </div>
          </div>

          {/* Modal Footer */}
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
              Save expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
