import React, { useState } from 'react';
import { X, FileText, Download, AlertCircle, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { generateMonthlyExpensePDF } from '../utils/pdfGenerator';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const DownloadReportModal = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    expenses,
    monthlyBudget,
    profile,
    preferences,
    formatCurrency,
    showToast,
  } = useApp();

  const { currentUser } = useAuth();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isReportModalOpen) return null;

  const handleClose = () => {
    setIsReportModalOpen(false);
  };

  // Compute stats for selected month/year
  const monthStr = String(selectedMonth).padStart(2, '0');
  const monthKey = `${selectedYear}-${monthStr}`;
  const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(monthKey));
  const totalSpent = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const count = monthExpenses.length;
  const monthName = MONTHS.find(m => m.value === selectedMonth)?.label || 'Selected Month';

  // Available years: current year - 3 to current year + 1
  const currentYear = now.getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  const handleDownload = async () => {
    if (count === 0) {
      showToast(`No expenses found in ${monthName} ${selectedYear}`, 'danger');
      return;
    }

    try {
      setIsGenerating(true);
      const userName = profile?.name || currentUser?.displayName || 'CampusFlow User';
      const userEmail = currentUser?.email || '';

      generateMonthlyExpensePDF({
        expenses,
        year: selectedYear,
        month: selectedMonth,
        monthlyBudget,
        userName,
        userEmail,
        currency: preferences?.currency || 'INR',
      });

      showToast(`Report downloaded for ${monthName} ${selectedYear}!`, 'success');
      handleClose();
    } catch (err) {
      showToast(err.message || 'Failed to generate PDF report', 'danger');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: 440,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-modal)',
          padding: 24,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-control)',
              background: 'var(--accent-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <FileText size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                Download Expense Report
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Generate an executive PDF financial summary
              </p>
            </div>
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

        {/* Month & Year Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
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
              }}
            >
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
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
              }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Preview Card */}
        <div style={{
          padding: '14px 16px',
          borderRadius: 'var(--radius-control)',
          border: '1px solid var(--border)',
          background: 'var(--bg-canvas)',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Summary for {monthName} {selectedYear}
            </span>
            <span style={{
              fontSize: '0.6875rem',
              padding: '2px 8px',
              borderRadius: 9999,
              background: count > 0 ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              color: count > 0 ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: 500,
            }}>
              {count} {count === 1 ? 'record' : 'records'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }} className="num">
              {formatCurrency(totalSpent)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {monthlyBudget > 0 ? `${Math.round((totalSpent / monthlyBudget) * 100)}% of budget` : 'No budget limit set'}
            </span>
          </div>

          {count === 0 && (
            <div style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}>
              <AlertCircle size={14} />
              <span>No expenses found in this month to report.</span>
            </div>
          )}
        </div>

        {/* Footer */}
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
            type="button"
            onClick={handleDownload}
            disabled={count === 0 || isGenerating}
            className="btn btn-primary"
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 'var(--radius-control)',
              background: count > 0 ? 'var(--accent)' : 'var(--border)',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: count > 0 && !isGenerating ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Download size={14} />
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};
