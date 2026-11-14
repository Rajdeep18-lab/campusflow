import React, { useState } from 'react';
import { X, PiggyBank, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BudgetModal = () => {
  const {
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    monthlyBudget,
    saveMonthlyBudget,
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  React.useEffect(() => {
    if (isBudgetModalOpen) {
      setInputVal(monthlyBudget > 0 ? monthlyBudget.toString() : '');
    }
  }, [isBudgetModalOpen, monthlyBudget]);

  if (!isBudgetModalOpen) return null;

  const handleClose = () => setIsBudgetModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveMonthlyBudget(parseFloat(inputVal) || 0);
    if (success) handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: 420,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-modal)',
          padding: 24,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              Set monthly budget
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>
              Set a spending limit to track against your expenses this month.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Close"
            style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6, display: 'block' }}>
              Monthly limit (₹)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}>
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="5000"
                className="form-input num"
                style={{
                  width: '100%',
                  height: 40,
                  paddingLeft: 30,
                  paddingRight: 12,
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                autoFocus
                required
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 6, display: 'block' }}>
              Enter 0 to clear the monthly budget limit.
            </span>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.8125rem',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: 'var(--accent)',
                color: '#FFFFFF',
              }}
            >
              Save budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
