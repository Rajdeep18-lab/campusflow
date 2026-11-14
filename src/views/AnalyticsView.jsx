import React, { useMemo } from 'react';
import {
  TrendingUp,
  AlertCircle,
  Check,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryColor } from '../utils/categoryColors';

export const AnalyticsView = () => {
  const {
    expenses,
    todos,
    monthlyBudget,
    budgetUsagePercent,
    remainingBudget,
    taskCompletionPercent,
    formatCurrency,
    setIsReportModalOpen,
    customCategories,
    profile,
  } = useApp();

  const isDark = profile?.theme === 'dark';
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonthNum = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonthNum + 1, 0).getDate();
  const daysRemaining = Math.max(daysInMonth - currentDay, 0);

  const monthName = now.toLocaleDateString('en-IN', { month: 'long' });
  const monthLabel = `1–${currentDay} ${monthName} ${currentYear}`;
  const monthPrefix = `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}`;

  // Month transactions
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.date && e.date.startsWith(monthPrefix));
  }, [expenses, monthPrefix]);

  const monthTotal = useMemo(() => {
    return monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [monthExpenses]);

  const dailyAvg = currentDay > 0 ? Math.round(monthTotal / currentDay) : 0;

  // Daily bars data
  const { dailyBars, maxDayVal, highestDay } = useMemo(() => {
    let max = 0;
    let highest = { day: 1, amount: 0 };
    const bars = Array.from({ length: currentDay }, (_, i) => {
      const dayNum = i + 1;
      const dateKey = `${monthPrefix}-${String(dayNum).padStart(2, '0')}`;
      const amount = expenses
        .filter(e => e.date === dateKey)
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      if (amount > max) max = amount;
      if (amount > highest.amount) highest = { day: dayNum, amount };

      return { day: dayNum, amount, isToday: dayNum === currentDay };
    });

    return {
      dailyBars: bars,
      maxDayVal: Math.max(max, 400),
      highestDay: highest,
    };
  }, [expenses, currentDay, monthPrefix]);

  // Zero-spending days
  const zeroSpendDays = useMemo(() => {
    return dailyBars.filter(d => d.amount === 0).map(d => d.day);
  }, [dailyBars]);

  // Tasks counts
  const totalTasks = todos.length;
  const doneTasks = todos.filter(t => t.completed).length;

  // Category breakdown (sorted)
  const categoryRanking = useMemo(() => {
    const map = {};
    monthExpenses.forEach(exp => {
      const cat = exp.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(exp.amount || 0);
    });

    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        pct: monthTotal > 0 ? Math.round((amount / monthTotal) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, monthTotal]);

  const topCategory = categoryRanking[0];

  // Projected end of month spending
  const projectedTotal = dailyAvg * daysInMonth;
  const projectedDifference = monthlyBudget > 0 ? monthlyBudget - projectedTotal : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            margin: 0,
          }}>
            Analytics
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>
            {monthLabel}
          </p>
        </div>

        {/* Action Controls: Month selector & Download Report Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            className="form-input"
            defaultValue={monthName}
            style={{
              height: 34,
              padding: '0 10px',
              fontSize: '0.8125rem',
              width: 'auto',
              cursor: 'pointer',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-control)',
              color: 'var(--text-primary)',
            }}
          >
            <option value={monthName}>{monthName} {currentYear}</option>
          </select>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="btn btn-primary"
            style={{
              height: 34,
              padding: '0 14px',
              borderRadius: 'var(--radius-control)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: 'var(--accent)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <FileText size={14} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* ── Summary Strip (4 cells) ── */}
      <div className="summary-strip">
        {/* Cell 1: Total spent */}
        <div className="summary-cell">
          <div className="summary-label">Total spent</div>
          <div className="summary-number num">
            {formatCurrency(monthTotal)}
          </div>
          <div className="summary-hint">
            {monthExpenses.length} transactions
          </div>
        </div>

        {/* Cell 2: Daily average */}
        <div className="summary-cell">
          <div className="summary-label">Daily average</div>
          <div className="summary-number num">
            {formatCurrency(dailyAvg)}
          </div>
          <div className="summary-hint">
            {highestDay.amount > 0 ? `Highest day: ${formatCurrency(highestDay.amount)} on ${highestDay.day} ${now.toLocaleDateString('en-IN', { month: 'short' })}` : 'No expenses yet'}
          </div>
        </div>

        {/* Cell 3: Budget used */}
        <div className="summary-cell">
          <div className="summary-label">Budget used</div>
          <div className="summary-number num">
            {monthlyBudget > 0 ? `${budgetUsagePercent}%` : '—'}
          </div>
          {monthlyBudget > 0 && (
            <div style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'var(--border)',
              margin: '6px 0 2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 2,
                width: `${Math.min(budgetUsagePercent, 100)}%`,
                background: 'var(--accent)',
              }} />
            </div>
          )}
          <div className="summary-hint">
            {monthlyBudget > 0 ? `${formatCurrency(remainingBudget)} remaining` : 'Set in Settings'}
          </div>
        </div>

        {/* Cell 4: Tasks completed */}
        <div className="summary-cell">
          <div className="summary-label">Tasks completed</div>
          <div className="summary-number num">
            {doneTasks} of {totalTasks}
          </div>
          {totalTasks > 0 && (
            <div style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: 'var(--border)',
              margin: '6px 0 2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 2,
                width: `${taskCompletionPercent}%`,
                background: 'var(--accent)',
              }} />
            </div>
          )}
          <div className="summary-hint">
            {taskCompletionPercent}% completion rate
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
        alignItems: 'flex-start',
      }}>
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Card: Daily spending */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Daily spending</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Dashed line is the {formatCurrency(dailyAvg)} average
              </span>
            </div>

            {/* Daily Bars with Y-Axis & Dashed Line */}
            <div style={{ position: 'relative', height: 160, display: 'flex', gap: 10, paddingTop: 10 }}>
              {/* Y-axis markers */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                width: 44,
                textAlign: 'right',
                paddingBottom: 20,
              }} className="num">
                <span>{formatCurrency(maxDayVal)}</span>
                <span>{formatCurrency(Math.round(maxDayVal / 2))}</span>
                <span>0</span>
              </div>

              {/* Chart canvas */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Horizontal dashed average line */}
                {dailyAvg > 0 && maxDayVal > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `calc(20px + ${(dailyAvg / maxDayVal) * 110}px)`,
                    borderBottom: '1px dashed var(--text-muted)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    opacity: 0.6,
                  }} />
                )}

                {/* Bars */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 3,
                  paddingBottom: 4,
                  borderBottom: '1px solid var(--border)',
                }}>
                  {dailyBars.map(bar => {
                    const heightPercent = maxDayVal > 0 ? (bar.amount / maxDayVal) * 100 : 0;
                    return (
                      <div
                        key={bar.day}
                        title={`Day ${bar.day}: ${formatCurrency(bar.amount)}`}
                        style={{
                          flex: 1,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'flex-end',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          width: '100%',
                          height: `${Math.max(heightPercent, bar.amount > 0 ? 4 : 0)}%`,
                          background: bar.isToday
                            ? 'var(--accent)'
                            : bar.amount > 0
                              ? (isDark ? '#2E4C3B' : '#88AC97')
                              : 'transparent',
                          borderRadius: '2px 2px 0 0',
                          minHeight: bar.amount > 0 ? 3 : 0,
                          transition: 'height 0.2s',
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* X-axis date labels */}
                <div style={{
                  height: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}>
                  <span>1</span>
                  {currentDay >= 5 && <span>5</span>}
                  {currentDay >= 10 && <span>10</span>}
                  {currentDay >= 15 && <span>15</span>}
                  {currentDay >= 20 && <span>20</span>}
                  {currentDay >= 25 && <span>25</span>}
                  <span>{currentDay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: By category */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">By category</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {categoryRanking.length} active categories
              </span>
            </div>

            {categoryRanking.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                No expenses logged for this month.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {categoryRanking.map(item => {
                  const color = getCategoryColor(item.name, isDark ? 'dark' : 'light', customCategories);
                  return (
                    <div key={item.name}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                        marginBottom: 6,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: color,
                            flexShrink: 0,
                          }} />
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                            {item.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            {item.pct}%
                          </span>
                          <span className="num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        background: 'var(--border)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          borderRadius: 3,
                          width: `${item.pct}%`,
                          background: color,
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Card: Budget status */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Budget</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {daysRemaining} days left in {monthName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }} className="num">
                {monthlyBudget > 0 ? `${budgetUsagePercent}%` : 'No budget set'}
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }} className="num">
                {monthlyBudget > 0 ? `${formatCurrency(remainingBudget)} left` : 'Set a spending limit'}
              </span>
            </div>

            {/* 8px progress bar */}
            <div style={{
              width: '100%',
              height: 8,
              borderRadius: 4,
              background: 'var(--border)',
              marginTop: 14,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 4,
                width: `${Math.min(budgetUsagePercent, 100)}%`,
                background: budgetUsagePercent > 90 ? 'var(--danger)' : 'var(--accent)',
                transition: 'width 0.4s ease',
              }} />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginTop: 8,
            }}>
              <span className="num">{formatCurrency(monthTotal)} spent</span>
              <span className="num">{monthlyBudget > 0 ? formatCurrency(monthlyBudget) : '—'}</span>
            </div>
          </div>

          {/* Card: Savings insights */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Savings insights</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Insight 1: Run rate */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <TrendingUp size={16} strokeWidth={1.75} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {monthlyBudget > 0 ? (
                    projectedDifference >= 0 ? (
                      <>At {formatCurrency(dailyAvg)} a day you are on track to finish {monthName} around {formatCurrency(projectedTotal)}, roughly <strong style={{ fontWeight: 600 }}>{formatCurrency(projectedDifference)} under budget</strong>.</>
                    ) : (
                      <>At current spending of {formatCurrency(dailyAvg)}/day, you may exceed your budget by {formatCurrency(Math.abs(projectedDifference))}.</>
                    )
                  ) : (
                    <>You spend an average of {formatCurrency(dailyAvg)} each day this month.</>
                  )}
                </div>
              </div>

              {/* Insight 2: Category distribution */}
              {topCategory && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <AlertCircle size={16} strokeWidth={1.75} style={{ color: 'var(--text-secondary)', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {topCategory.name} is {topCategory.pct}% of your spending. Cutting it by a quarter would save about <strong style={{ fontWeight: 600 }}>{formatCurrency(Math.round(topCategory.amount * 0.25))}</strong> so far this month.
                  </div>
                </div>
              )}

              {/* Insight 3: Zero-spending days */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Check size={16} strokeWidth={1.75} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {zeroSpendDays.length > 0 ? (
                    <>You have had {zeroSpendDays.length} day{zeroSpendDays.length > 1 ? 's' : ''} with no spending ({zeroSpendDays.slice(0, 3).join(', ')} {now.toLocaleDateString('en-IN', { month: 'short' })}).</>
                  ) : (
                    <>You have recorded expenses on every active day so far this month.</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
