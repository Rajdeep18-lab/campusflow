import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, getCategoryColor } from '../utils/categoryColors';

export const ExpenseView = () => {
  const {
    expenses,
    monthlyBudget,
    todayExpensesTotal,
    remainingBudget,
    budgetUsagePercent,
    setIsQuickAddExpenseOpen,
    setIsBudgetModalOpen,
    setEditingExpense,
    deleteExpense,
    profile,
  } = useApp();

  const isDark = profile?.theme === 'dark';
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDay = now.getDate();

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'highest' | 'lowest'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Month stats
  const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(currentMonthPrefix));
  const monthSpent = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const todayCount = expenses.filter(e => e.date === todayStr).length;
  const avgDaily = currentDay > 0 ? Math.round(monthSpent / currentDay) : 0;

  // Filtering & sorting
  const filtered = useMemo(() => {
    return expenses
      .filter(exp => {
        const matchesSearch = (exp.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (exp.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (exp.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCat === 'All' || exp.category === selectedCat;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') return (b.date || '').localeCompare(a.date || '') || (b.createdAt || 0) - (a.createdAt || 0);
        if (sortOrder === 'oldest') return (a.date || '').localeCompare(b.date || '') || (a.createdAt || 0) - (b.createdAt || 0);
        if (sortOrder === 'highest') return Number(b.amount || 0) - Number(a.amount || 0);
        if (sortOrder === 'lowest') return Number(a.amount || 0) - Number(b.amount || 0);
        return 0;
      });
  }, [expenses, searchTerm, selectedCat, sortOrder]);

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr === todayStr) return 'Today';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Grouped for mobile view
  const groupedByDate = useMemo(() => {
    const groups = {};
    paginated.forEach(exp => {
      const key = exp.date || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(exp);
    });
    return groups;
  }, [paginated]);

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
            Expenses
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
            Everything you have spent in {currentMonthName}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="btn btn-secondary"
          >
            <span>Set budget</span>
          </button>
          <button
            onClick={() => setIsQuickAddExpenseOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={14} strokeWidth={2} />
            <span>Add expense</span>
          </button>
        </div>
      </div>

      {/* ── Summary Strip (3 cells) ── */}
      <div className="summary-strip three-cells">
        {/* Cell 1: Spent today */}
        <div className="summary-cell">
          <div className="summary-label">Spent today</div>
          <div className="summary-number">
            ₹{todayExpensesTotal.toLocaleString('en-IN')}
          </div>
          <div className="summary-hint">
            {todayCount} transaction{todayCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Cell 2: Spent this month */}
        <div className="summary-cell">
          <div className="summary-label">Spent this month</div>
          <div className="summary-number">
            ₹{monthSpent.toLocaleString('en-IN')}
          </div>
          <div className="summary-hint">
            {monthExpenses.length} transactions · avg ₹{avgDaily} a day
          </div>
        </div>

        {/* Cell 3: Budget remaining */}
        <div className="summary-cell">
          <div className="summary-label">Budget remaining</div>
          <div className="summary-number">
            ₹{remainingBudget > 0 ? remainingBudget.toLocaleString('en-IN') : (monthlyBudget > 0 ? 0 : '—')}
          </div>
          {monthlyBudget > 0 && (
            <div style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'var(--surface-2)',
              margin: '6px 0 2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 2,
                width: `${Math.min(budgetUsagePercent, 100)}%`,
                background: 'var(--accent-solid)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          )}
          <div className="summary-hint">
            {monthlyBudget > 0
              ? `${budgetUsagePercent}% of ₹${monthlyBudget.toLocaleString('en-IN')} used`
              : 'Set a monthly budget to track'}
          </div>
        </div>
      </div>

      {/* ── Filter Toolbar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Left: Search input + Category chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          flex: 1,
          minWidth: 260,
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: 220 }}>
            <Search
              size={14}
              color="var(--text-muted)"
              strokeWidth={1.75}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search expenses"
              className="form-input"
              style={{ paddingLeft: 30, height: 34, fontSize: '13px' }}
            />
          </div>

          {/* Category Chips with 8px colored squares */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 2,
            maxWidth: '100%',
          }}>
            <button
              onClick={() => { setSelectedCat('All'); setCurrentPage(1); }}
              className={`chip${selectedCat === 'All' ? ' active' : ''}`}
            >
              <span>All</span>
            </button>
            {CATEGORIES.map(cat => {
              const isActive = selectedCat === cat.id;
              const dotColor = getCategoryColor(cat.id, isDark ? 'dark' : 'light');
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCat(cat.id); setCurrentPage(1); }}
                  className={`chip${isActive ? ' active' : ''}`}
                >
                  <span
                    className="chip-color-dot"
                    style={{ background: isActive ? '#FFFFFF' : dotColor }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="form-input"
            style={{ height: 34, padding: '0 8px', fontSize: '12px', width: 'auto', cursor: 'pointer' }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </div>
      </div>

      {/* ── Desktop Table View (>= 768px) ── */}
      <div className="card hidden md:block" style={{ padding: 0, overflow: 'hidden' }}>
        {paginated.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No expenses found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Description</th>
                  <th style={{ width: '22%' }}>Category</th>
                  <th style={{ width: '20%' }}>Date</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Amount</th>
                  <th style={{ width: '8%', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(exp => {
                  const catColor = getCategoryColor(exp.category, isDark ? 'dark' : 'light');
                  return (
                    <tr key={exp.id}>
                      <td style={{ fontWeight: 500 }}>
                        {exp.title}
                        {exp.notes && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
                            {exp.notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 2,
                              background: catColor,
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                            {exp.category}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {formatDateLabel(exp.date)}
                      </td>
                      <td style={{
                        textAlign: 'right',
                        fontWeight: 600,
                        fontFeatureSettings: '"tnum" 1',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        ₹{Number(exp.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={() => setEditingExpense(exp)}
                            className="btn-icon"
                            title="Edit expense"
                            style={{ width: 28, height: 28 }}
                          >
                            <Pencil size={13} strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="btn-icon"
                            title="Delete expense"
                            style={{ width: 28, height: 28 }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={13} strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Footer */}
        {totalItems > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            <div>
              Showing {paginated.length} of {totalItems}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ height: 28, padding: '0 10px', fontSize: '12px' }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="btn btn-secondary"
                style={{ height: 28, padding: '0 10px', fontSize: '12px' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Grouped List View (< 768px, Page 12 in PDF) ── */}
      <div className="block md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="card" style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No expenses found.
          </div>
        ) : (
          Object.entries(groupedByDate).map(([dateKey, items]) => (
            <div key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', paddingLeft: 4 }}>
                {formatDateLabel(dateKey)}
              </div>
              <div className="card" style={{ padding: '0 16px' }}>
                {items.map((exp, idx) => {
                  const catColor = getCategoryColor(exp.category, isDark ? 'dark' : 'light');
                  return (
                    <div
                      key={exp.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1, paddingRight: 12 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                          {exp.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <span style={{ width: 7, height: 7, borderRadius: 2, background: catColor, flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {exp.category}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          fontFeatureSettings: '"tnum" 1',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          ₹{Number(exp.amount || 0).toLocaleString('en-IN')}
                        </span>
                        <div style={{ display: 'inline-flex', gap: 2 }}>
                          <button
                            onClick={() => setEditingExpense(exp)}
                            className="btn-icon"
                            style={{ width: 28, height: 28 }}
                            title="Edit"
                          >
                            <Pencil size={13} strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="btn-icon"
                            style={{ width: 28, height: 28 }}
                            title="Delete"
                          >
                            <Trash2 size={13} strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ height: 32 }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="btn btn-secondary"
                style={{ height: 32 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile, Page 12 in PDF) */}
      <button
        onClick={() => setIsQuickAddExpenseOpen(true)}
        className="mobile-fab-pill md:hidden"
        title="Add Expense"
      >
        <Plus size={16} strokeWidth={2} />
        <span>Add expense</span>
      </button>
    </div>
  );
};
