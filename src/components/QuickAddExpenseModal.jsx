import React, { useState, useEffect } from 'react';
import { X, CreditCard, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  { id: 'Food',          label: 'Food & Dining',      icon: '🍲' },
  { id: 'Travel',        label: 'Travel & Transport',  icon: '🚌' },
  { id: 'Books',         label: 'Books & Academics',   icon: '📚' },
  { id: 'Hostel',        label: 'Hostel Rent',         icon: '🏠' },
  { id: 'Mess',          label: 'Mess & Canteen',      icon: '🍱' },
  { id: 'Shopping',      label: 'Shopping & Gear',     icon: '🛍️' },
  { id: 'Recharge',      label: 'Phone & Internet',    icon: '📱' },
  { id: 'Entertainment', label: 'Fun & Movies',        icon: '🎬' },
  { id: 'Others',        label: 'Other Expenses',      icon: '💡' },
];

export const QuickAddExpenseModal = () => {
  const {
    isQuickAddExpenseOpen,
    setIsQuickAddExpenseOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    editExpense,
  } = useApp();

  const [title,    setTitle]    = useState('');
  const [amount,   setAmount]   = useState('');
  const [category, setCategory] = useState('Food');
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [notes,    setNotes]    = useState('');
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ? editingExpense.amount.toString() : '');
      setCategory(editingExpense.category || 'Food');
      setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
      setNotes(editingExpense.notes || '');
    } else {
      setTitle(''); setAmount(''); setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]); setNotes('');
    }
    setError('');
  }, [editingExpense, isQuickAddExpenseOpen]);

  if (!isQuickAddExpenseOpen && !editingExpense) return null;

  const handleClose = () => {
    setIsQuickAddExpenseOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter an expense title'); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { setError('Please enter a valid amount greater than ₹0'); return; }

    const success = editingExpense
      ? editExpense(editingExpense.id, { title, amount: parsed, category, date, notes })
      : addExpense({ title, amount: parsed, category, date, notes });

    if (success) handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--accent-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CreditCard size={17} color="var(--accent)" strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {editingExpense ? 'Edit Expense' : 'Log Expense'}
              </h3>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Record your college spending accurately
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn-icon" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}>₹</span>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                placeholder="0.00"
                className="form-input"
                style={{ paddingLeft: 28, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Expense Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Canteen lunch, Bus pass, Textbook..."
              className="form-input"
              required
              maxLength={80}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 6,
            }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${category === cat.id ? 'var(--accent)' : 'var(--border-base)'}`,
                    background: category === cat.id ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                    color: category === cat.id ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: category === cat.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    textAlign: 'left',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{cat.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Notes row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="form-input"
                required
                style={{ fontSize: '0.8125rem' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Paid via UPI..."
                className="form-input"
                maxLength={100}
                style={{ fontSize: '0.8125rem' }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" onClick={handleClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary btn-sm">
            {editingExpense ? <Check size={13} /> : <Plus size={13} />}
            {editingExpense ? 'Save Changes' : 'Record Expense'}
          </button>
        </div>
      </div>
    </div>
  );
};
