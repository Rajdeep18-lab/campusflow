import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  Edit3,
  Copy,
  Wallet,
  TrendingUp,
  PiggyBank,
  CalendarDays,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

const CATEGORY_DATA = {
  Food:          { emoji: '🍲', color: '#C77726', label: 'Food & Dining' },
  Travel:        { emoji: '🚌', color: '#4A7C59', label: 'Travel' },
  Books:         { emoji: '📚', color: '#685B88', label: 'Books' },
  Hostel:        { emoji: '🏠', color: '#B25D42', label: 'Hostel' },
  Mess:          { emoji: '🍱', color: '#2F6B4F', label: 'Mess' },
  Shopping:      { emoji: '🛍️', color: '#A85A75', label: 'Shopping' },
  Recharge:      { emoji: '📱', color: '#3C6E71', label: 'Recharge' },
  Entertainment: { emoji: '🎬', color: '#7D688D', label: 'Entertainment' },
  Others:        { emoji: '💡', color: '#7A7568', label: 'Others' },
};

const CATEGORIES = ['All', ...Object.keys(CATEGORY_DATA)];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const todayStr = new Date().toISOString().split('T')[0];

export const ExpenseView = () => {
  const {
    expenses,
    deleteExpense,
    duplicateExpense,
    setEditingExpense,
    setIsQuickAddExpenseOpen,
    monthlyBudget,
    monthlyExpensesTotal,
    todayExpensesTotal,
    remainingBudget,
    budgetUsagePercent,
    setIsBudgetModalOpen,
    isOverBudget,
  } = useApp();

  const [searchTerm,   setSearchTerm]   = useState('');
  const [selectedCat,  setSelectedCat]  = useState('All');
  const [sortBy,       setSortBy]       = useState('date-desc');
  const [showFilters,  setShowFilters]  = useState(false);

  const filteredExpenses = expenses
    .filter(e => {
      const catOk    = selectedCat === 'All' || e.category === selectedCat;
      const searchOk =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        e.amount.toString().includes(searchTerm);
      return catOk && searchOk;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc')   return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc')    return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc')  return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Expense Manager
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Log, track and categorize your daily college expenditures.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setIsBudgetModalOpen(true)} className="btn btn-secondary btn-sm">
            <Wallet size={14} style={{ color: 'var(--accent)' }} />
            Set Budget
          </button>
          <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} strokeWidth={2.5} />
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">Today's Spend</span>
            <div className="stat-icon-box" style={{ background: 'var(--accent-muted)' }}>
              <TrendingUp size={16} color="var(--accent)" />
            </div>
          </div>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
            ₹{todayExpensesTotal.toLocaleString('en-IN')}
          </div>
          <div className="stat-sub">{expenses.filter(e => e.date === todayStr).length} transactions today</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">Monthly Total</span>
            <div className="stat-icon-box" style={{ background: 'rgba(60, 110, 113, 0.12)' }}>
              <CalendarDays size={16} color="var(--color-info)" />
            </div>
          </div>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>
            ₹{monthlyExpensesTotal.toLocaleString('en-IN')}
          </div>
          <div className="stat-sub">{expenses.length} total transactions</div>
        </div>

        <div className="stat-card" onClick={() => setIsBudgetModalOpen(true)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">Budget Remaining</span>
            <div className="stat-icon-box" style={{ background: isOverBudget ? 'var(--color-danger-bg)' : 'var(--accent-muted)' }}>
              <PiggyBank size={16} color={isOverBudget ? 'var(--color-danger)' : 'var(--accent)'} />
            </div>
          </div>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', color: isOverBudget ? 'var(--color-danger)' : undefined }}>
            {monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Not set'}
          </div>
          <div className="stat-sub">
            {monthlyBudget > 0 ? `${budgetUsagePercent}% of ₹${monthlyBudget.toLocaleString('en-IN')} used` : 'Click to set limit'}
          </div>
        </div>
      </div>

      {/* Budget progress bar */}
      {monthlyBudget > 0 && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {isOverBudget ? '⚠️ Budget limit exceeded' : 'Monthly Budget Tracking'}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isOverBudget ? 'var(--color-danger)' : 'var(--text-primary)' }}>
              {budgetUsagePercent}% used
            </span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(budgetUsagePercent, 100)}%`,
                background: isOverBudget ? 'var(--color-danger)' : 'var(--accent)',
              }}
            />
          </div>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title, category, notes..."
              className="form-input"
              style={{ paddingLeft: 34, height: 38, fontSize: '0.8125rem' }}
            />
          </div>

          <button
            onClick={() => setShowFilters(f => !f)}
            className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: 6, height: 38 }}
          >
            <SlidersHorizontal size={13} />
            Categories
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <ArrowUpDown size={13} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-select"
              style={{ height: 38, width: 'auto', fontSize: '0.8125rem', paddingRight: 28 }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Category filter chips */}
        {showFilters && (
          <div style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingTop: 12,
            marginTop: 12,
            borderTop: '1px solid var(--border-base)',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}>
            {CATEGORIES.map(cat => {
              const isActive = selectedCat === cat;
              const cd = CATEGORY_DATA[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-base)'}`,
                    background: isActive ? 'var(--bg-active)' : 'var(--bg-tertiary)',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {cd && <span>{cd.emoji}</span>}
                  {cat === 'All' ? 'All Categories' : cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Results label ── */}
      {(searchTerm || selectedCat !== 'All') && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Showing {filteredExpenses.length} of {expenses.length} records
          {selectedCat !== 'All' && ` in ${selectedCat}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* ── Expense List ── */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={expenses.length === 0 ? 'No expenses yet' : 'No matching expenses'}
          description={
            expenses.length === 0
              ? 'Start tracking your college spending. All records stay secure on your device.'
              : 'Try adjusting your search criteria or category filter.'
          }
          actionLabel={expenses.length === 0 ? 'Add First Expense' : undefined}
          onAction={expenses.length === 0 ? () => setIsQuickAddExpenseOpen(true) : undefined}
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {filteredExpenses.map((exp, i) => {
            const cd = CATEGORY_DATA[exp.category] || CATEGORY_DATA.Others;
            const isToday = exp.date === todayStr;
            return (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  borderBottom: i < filteredExpenses.length - 1 ? '1px solid var(--border-base)' : 'none',
                  transition: 'background 0.12s',
                  borderLeft: `3px solid ${cd.color}`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Category icon pill */}
                <div
                  className="cat-pill"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  {cd.emoji}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 280,
                    }}>
                      {exp.title}
                    </span>
                    {/* Category badge */}
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: cd.color,
                      background: 'var(--bg-tertiary)',
                      border: `1px solid var(--border-base)`,
                      padding: '2px 8px',
                      borderRadius: 20,
                      flexShrink: 0,
                    }}>
                      {exp.category}
                    </span>
                    {isToday && (
                      <span className="badge badge-accent" style={{ fontSize: '0.625rem', padding: '2px 7px' }}>
                        Today
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                    {/* Date */}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)' }}>
                      <CalendarDays size={11} />
                      {formatDate(exp.date)}
                    </span>
                    {/* Notes preview */}
                    {exp.notes && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 220,
                      }}>
                        · {exp.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    letterSpacing: '-0.025em',
                    minWidth: 76,
                    textAlign: 'right',
                  }}>
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button
                      onClick={() => duplicateExpense(exp.id)}
                      className="btn-icon"
                      title="Duplicate expense"
                      style={{ minWidth: 32, minHeight: 32 }}
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => setEditingExpense(exp)}
                      className="btn-icon"
                      style={{ color: 'var(--accent)' }}
                      title="Edit expense"
                      style={{ minWidth: 32, minHeight: 32 }}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="btn-icon"
                      style={{ color: 'var(--color-danger)' }}
                      title="Delete expense"
                      style={{ minWidth: 32, minHeight: 32 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
