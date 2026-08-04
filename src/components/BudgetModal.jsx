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
    const success = saveMonthlyBudget(parseFloat(inputVal));
    if (success) handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 400 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'rgba(139,92,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PiggyBank size={17} color="#8b5cf6" strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Set Monthly Budget
              </h3>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Control your spending for this month
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn-icon" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Monthly Budget Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.125rem', fontWeight: 700,
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none',
                }}>₹</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="e.g. 5000"
                  className="form-input"
                  style={{ paddingLeft: 28, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}
                  autoFocus
                  required
                />
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Set to 0 to remove the budget limit.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={13} />
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
