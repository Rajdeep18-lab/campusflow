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
  Food:          { emoji: '🍲', color: '#F0A24B', label: 'Food & Dining' },
  Travel:        { emoji: '🚌', color: '#6FB6E8', label: 'Travel' },
  Books:         { emoji: '📚', color: '#8A7FE8', label: 'Books' },
  Hostel:        { emoji: '🏠', color: '#E8875B', label: 'Hostel' },
  Mess:          { emoji: '🍱', color: '#4FBF8B', label: 'Mess' },
  Shopping:      { emoji: '🛍️', color: '#E86FA8', label: 'Shopping' },
  Recharge:      { emoji: '📱', color: '#5BCFE0', label: 'Recharge' },
  Entertainment: { emoji: '🎬', color: '#C98AE8', label: 'Entertainment' },
  Others:        { emoji: '💡', color: '#9AA5B8', label: 'Others' },
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Expense Manager
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Log, track and categorize every rupee spent during college.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setIsBudgetModalOpen(true)} className="btn btn-secondary btn-sm">
            <Wallet size={13} style={{ color: 'var(--accent)' }} />
            Set Budget
          </button>
          <button onClick={() => setIsQuickAddExpenseOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={13} strokeWidth={2.5} />
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">Today's Expense</span>
            <div className="stat-icon-box" style={{ background: 'rgba(52,199,123,0.12)' }}>
              <TrendingUp size={16} color="var(--color-success)" />
            </div>
          </div>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>₹{todayExpensesTotal.toLocaleString('en-IN')}</div>
          <div className="stat-sub">{expenses.filter(e => e.date === todayStr).length} transactions today</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">Monthly Total</span>
            <div className="stat-icon-box" style={{ background: 'rgba(108,142,245,0.12)' }}>
              <CalendarDays size={16} color="var(--accent-blue)" />
            </div>
          </div>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>₹{monthlyExpensesTotal.toLocaleString('en-IN')}</div>
          <div className="stat-sub">{expenses.length} total transactions</div>
        </div>

        <div className="stat-card" onClick={() => setIsBudgetModalOpen(true)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-label">Budget Remaining</span>
            <div className="stat-icon-box" style={{ background: 'rgba(232,163,61,0.12)' }}>
              <PiggyBank size={16} color="var(--accent)" />
            </div>
          </div>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', color: isOverBudget ? 'var(--color-danger)' : undefined }}>
            {monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Not set'}
          </div>
          <div className="stat-sub">
            {monthlyBudget > 0 ? `${budgetUsagePercent}% of ₹${monthlyBudget.toLocaleString('en-IN')} used` : 'Click to set budget'}
          </div>
        </div>
      </div>

      {/* Budget progress bar */}
      {monthlyBudget > 0 && (
        <div className="card" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {isOverBudget ? '⚠️ Over Budget' : 'Budget Progress'}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isOverBudget ? 'var(--color-danger)' : 'var(--text-primary)' }}>
              {budgetUsagePercent}% used
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${Math.min(budgetUsagePercent, 100)}%`,
              background: isOverBudget ? 'linear-gradient(90deg,#ef4444,#dc2626)' : 'linear-gradient(90deg,#10b981,#059669)',
              transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 180px', maxWidth: 280 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search expenses..."
              className="form-input"
              style={{ paddingLeft: 30, height: 34, fontSize: '0.8125rem' }}
            />
          </div>

          <button
            onClick={() => setShowFilters(f => !f)}
            className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: 6 }}
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <ArrowUpDown size={13} color="var(--text-muted)" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select" style={{ height: 34, width: 'auto', fontSize: '0.8125rem', paddingRight: 28 }}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Category filter chips */}
        {showFilters && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-base)' }}>
            {CATEGORIES.map(cat => {
              const isActive = selectedCat === cat;
              const cd = CATEGORY_DATA[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${isActive ? (cd?.color || 'var(--accent)') : 'var(--border-base)'}`,
                    background: isActive ? `${cd?.color || 'var(--accent)'}18` : 'var(--bg-tertiary)',
                    color: isActive ? (cd?.color || 'var(--accent)') : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.12s',
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
          Showing {filteredExpenses.length} of {expenses.length} expenses
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
              ? 'Start logging your college expenses. All data is saved privately on your device.'
              : 'Try adjusting your search or category filter.'
          }
          actionLabel={expenses.length === 0 ? 'Add First Expense' : undefined}
          onAction={expenses.length === 0 ? () => setIsQuickAddExpenseOpen(true) : undefined}
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {filteredExpenses.map((exp, i) => {
            const cd      = CATEGORY_DATA[exp.category] || CATEGORY_DATA.Others;
            const isToday = exp.date === todayStr;
            return (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderBottom: i < filteredExpenses.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
                    background: `${cd.color}14`,
                    border: `1px solid ${cd.color}25`,
                  }}
                >
                  {cd.emoji}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)',
                      letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis', maxWidth: 260,
                    }}>
                      {exp.title}
                    </span>
                    {/* Category badge */}
                    <span style={{
                      fontSize: '0.5625rem', fontWeight: 700, color: cd.color,
                      background: `${cd.color}15`, border: `1px solid ${cd.color}25`,
                      padding: '2px 6px', borderRadius: 20, flexShrink: 0,
                    }}>
                      {exp.category}
                    </span>
                    {isToday && (
                      <span className="badge badge-today" style={{ fontSize: '0.5625rem', padding: '1px 6px' }}>Today</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                    {/* Date */}
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-mono)' }}>
                      <CalendarDays size={10} />
                      {formatDate(exp.date)}
                    </span>
                    {/* Notes preview */}
                    {exp.notes && (
                      <span style={{
                        fontSize: '0.6875rem', color: 'var(--text-muted)', fontStyle: 'italic',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200,
                      }}>
                        · {exp.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem', fontWeight: 800, color: 'var(--color-success)',
                    letterSpacing: '-0.025em', minWidth: 72, textAlign: 'right',
                  }}>
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button onClick={() => duplicateExpense(exp.id)} className="btn-icon" title="Duplicate">
                      <Copy size={13} />
                    </button>
                    <button onClick={() => setEditingExpense(exp)} className="btn-icon" style={{ color: '#14b8a6' }} title="Edit">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => deleteExpense(exp.id)} className="btn-icon" style={{ color: 'var(--color-danger)' }} title="Delete">
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
