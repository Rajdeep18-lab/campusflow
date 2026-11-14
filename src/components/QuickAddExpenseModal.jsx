import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CATEGORIES,
  PAYMENT_METHODS,
  CUSTOM_CATEGORY_ICONS,
  CUSTOM_CATEGORY_COLORS,
  getCategoryColor,
  getCategoryIcon,
} from '../utils/categoryColors';

export const QuickAddExpenseModal = () => {
  const {
    isQuickAddExpenseOpen,
    setIsQuickAddExpenseOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    editExpense,
    customCategories,
    addCustomCategory,
    preferences,
    currencySymbol,
    theme,
  } = useApp();

  const isEdit = Boolean(editingExpense);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Custom Category creation sub-flow
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Tag');
  const [newCatColorIdx, setNewCatColorIdx] = useState(0);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const amountInputRef = useRef(null);

  // Populate fields on open or edit
  useEffect(() => {
    if (isQuickAddExpenseOpen) {
      if (editingExpense) {
        setTitle(editingExpense.title || '');
        setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
        setCategory(editingExpense.category || 'Food');
        setPaymentMethod(editingExpense.paymentMethod || 'UPI');
        setDate(editingExpense.date || new Date().toISOString().split('T')[0]);
        setNotes(editingExpense.notes || '');
      } else {
        setTitle('');
        setAmount('');
        setCategory(preferences?.defaultCategory || 'Food');
        setPaymentMethod(preferences?.defaultPaymentMethod || 'UPI');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
      setShowAddCustom(false);
      setValidationError('');
      setTimeout(() => amountInputRef.current?.focus(), 80);
    }
  }, [isQuickAddExpenseOpen, editingExpense, preferences]);

  if (!isQuickAddExpenseOpen) return null;

  const handleClose = () => {
    setIsQuickAddExpenseOpen(false);
    setEditingExpense(null);
    setShowAddCustom(false);
    setValidationError('');
  };

  const handleCreateCustomCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const chosenColor = CUSTOM_CATEGORY_COLORS[newCatColorIdx] || CUSTOM_CATEGORY_COLORS[0];
    const created = addCustomCategory({
      name: newCatName.trim(),
      iconName: newCatIcon,
      light: chosenColor.light,
      dark: chosenColor.dark,
    });

    if (created) {
      setCategory(created.label);
      setNewCatName('');
      setShowAddCustom(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter an amount greater than 0.');
      amountInputRef.current?.focus();
      return;
    }

    if (!title.trim()) {
      setValidationError('Please enter a description or merchant name.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        editExpense(editingExpense.id, {
          title: title.trim(),
          amount: parsedAmount,
          category,
          paymentMethod,
          date,
          notes: notes.trim(),
        });
      } else {
        addExpense({
          title: title.trim(),
          amount: parsedAmount,
          category,
          paymentMethod,
          date,
          notes: notes.trim(),
        });
      }
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine standard and custom categories
  const allCategoryList = [
    ...CATEGORIES,
    ...customCategories.map(c => {
      const iconDef = CUSTOM_CATEGORY_ICONS.find(i => i.id === c.iconName);
      return {
        id: c.label,
        label: c.label,
        icon: iconDef ? iconDef.icon : Tag,
        light: c.light,
        dark: c.dark,
        isCustom: true,
      };
    }),
  ];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card bottom-sheet"
        style={{
          width: '100%',
          maxWidth: 540,
          maxHeight: '90vh',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-modal)',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="bottom-sheet-handle" />

        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              {isEdit ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isEdit ? 'Update details for this transaction' : 'Log a purchase, meal, or campus bill'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn-icon"
            aria-label="Close"
            style={{ width: 30, height: 30, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Validation banner */}
          {validationError && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-control)',
              background: 'rgba(180,35,24,0.08)',
              border: '1px solid var(--danger)',
              fontSize: '0.8125rem',
              color: 'var(--danger)',
            }}>
              {validationError}
            </div>
          )}

          {/* Amount input row */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Amount <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--accent)',
                pointerEvents: 'none',
              }}>
                {currencySymbol}
              </span>
              <input
                ref={amountInputRef}
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  if (validationError) setValidationError('');
                }}
                className="num"
                style={{
                  width: '100%',
                  height: 48,
                  paddingLeft: 38,
                  paddingRight: 14,
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          </div>

          {/* Description input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Expense Title <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lunch at Canteen, Notebooks, Metro card recharge"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (validationError) setValidationError('');
              }}
              style={{
                width: '100%',
                height: 38,
                padding: '0 12px',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-control)',
                border: '1px solid var(--border)',
                background: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* Category Selection Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Category <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddCustom(prev => !prev)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: 0,
                }}
              >
                <Plus size={13} />
                {showAddCustom ? 'Close Custom' : 'Custom Category'}
              </button>
            </div>

            {/* Custom Category Creation Drawer/Inline Box */}
            {showAddCustom && (
              <div style={{
                padding: 12,
                borderRadius: 'var(--radius-control)',
                background: 'var(--bg-canvas)',
                border: '1px dashed var(--accent)',
                marginBottom: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Create New Category
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Category name (e.g. Subscriptions)"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    style={{
                      flex: 1,
                      height: 34,
                      padding: '0 10px',
                      borderRadius: 'var(--radius-control)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCustomCategory}
                    disabled={!newCatName.trim()}
                    className="btn btn-primary"
                    style={{
                      height: 34,
                      padding: '0 12px',
                      fontSize: '0.75rem',
                      background: 'var(--accent)',
                      color: '#fff',
                      borderRadius: 'var(--radius-control)',
                    }}
                  >
                    Save
                  </button>
                </div>

                {/* Icon options */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginRight: 2 }}>Icon:</span>
                  {CUSTOM_CATEGORY_ICONS.map(i => {
                    const IconComp = i.icon;
                    const isSelected = newCatIcon === i.id;
                    return (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => setNewCatIcon(i.id)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <IconComp size={13} />
                      </button>
                    );
                  })}
                </div>

                {/* Color swatches */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginRight: 2 }}>Color:</span>
                  {CUSTOM_CATEGORY_COLORS.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewCatColorIdx(idx)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: newCatColorIdx === idx ? '2px solid var(--text-primary)' : '1px solid transparent',
                        background: c.light,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Category Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
              gap: 8,
              maxHeight: 180,
              overflowY: 'auto',
              padding: 2,
            }}>
              {allCategoryList.map(cat => {
                const IconComponent = cat.icon || getCategoryIcon(cat.label, customCategories);
                const color = cat.light || getCategoryColor(cat.label, theme, customCategories);
                const isSelected = category.toLowerCase() === cat.label.toLowerCase();

                return (
                  <button
                    key={cat.id || cat.label}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-control)',
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-canvas)',
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: 38,
                    }}
                  >
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}>
                      <IconComponent size={11} strokeWidth={2.2} />
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Date <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 10px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm.id} value={pm.id}>{pm.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Optional Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Split with Rohan, Exam guide revision"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                padding: '0 12px',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-control)',
                border: '1px solid var(--border)',
                background: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Actions Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 8,
            paddingTop: 12,
            borderTop: '1px solid var(--border)',
          }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 'var(--radius-control)',
                fontSize: '0.8125rem',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: 'var(--radius-control)',
                background: 'var(--accent)',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>{isEdit ? 'Save Changes' : 'Add Expense'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
