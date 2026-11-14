import React, { useMemo } from 'react';
import {
  TrendingUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView = () => {
  const {
    expenses,
    todos,
    monthlyBudget,
    budgetUsagePercent,
    remainingBudget,
    taskCompletionPercent,
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
      const cat = exp.category || 'Others';
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
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1.25,
          }}>
            Analytics
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 4 }}>
            {monthLabel}
          </p>
        </div>

        {/* Month Selector dropdown */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            className="form-input"
            defaultValue={monthName}
            style={{ height: 34, padding: '0 10px', fontSize: '13px', width: 'auto', cursor: 'pointer' }}
          >
            <option value={monthName}>{monthName} {currentYear}</option>
          </select>
        </div>
      </div>

      {/* ── Summary Strip (4 cells) ── */}
      <div className="summary-strip">
        {/* Cell 1: Total spent */}
        <div className="summary-cell">
          <div className="summary-label">Total spent</div>
          <div className="summary-number">
            ₹{monthTotal.toLocaleString('en-IN')}
          </div>
          <div className="summary-hint">
            {monthExpenses.length} transactions
          </div>
        </div>

        {/* Cell 2: Daily average */}
        <div className="summary-cell">
          <div className="summary-label">Daily average</div>
          <div className="summary-number">
            ₹{dailyAvg.toLocaleString('en-IN')}
          </div>
          <div className="summary-hint">
            {highestDay.amount > 0 ? `Highest day: ₹${highestDay.amount} on ${highestDay.day} ${now.toLocaleDateString('en-IN', { month: 'short' })}` : 'No expenses yet'}
          </div>
        </div>

        {/* Cell 3: Budget used */}
        <div className="summary-cell">
          <div className="summary-label">Budget used</div>
          <div className="summary-number">
            {monthlyBudget > 0 ? `${budgetUsagePercent}%` : '—'}
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
              }} />
            </div>
          )}
          <div className="summary-hint">
            {monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')} remaining` : 'Set in Settings'}
          </div>
        </div>

        {/* Cell 4: Tasks completed */}
        <div className="summary-cell">
          <div className="summary-label">Tasks completed</div>
          <div className="summary-number">
            {doneTasks} of {totalTasks}
          </div>
          {totalTasks > 0 && (
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
                width: `${taskCompletionPercent}%`,
                background: 'var(--accent-solid)',
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
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Dashed line is the ₹{dailyAvg} average
              </span>
            </div>

            {/* Daily Bars with Y-Axis & Dashed Line */}
            <div style={{ position: 'relative', height: 160, display: 'flex', gap: 10, paddingTop: 10 }}>
              {/* Y-axis markers */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--text-muted)',
                width: 34,
                textAlign: 'right',
                paddingBottom: 20,
              }}>
                <span>₹{maxDayVal}</span>
                <span>₹{Math.round(maxDayVal / 2)}</span>
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
                    bottom: `${Math.min((dailyAvg / maxDayVal) * 100, 95)}%`,
                    borderTop: '1px dashed var(--text-muted)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Bars */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 4,
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 2,
                }}>
                  {dailyBars.map(({ day, amount, isToday }) => {
                    const heightPct = maxDayVal > 0 ? (amount / maxDayVal) * 100 : 0;
                    return (
                      <div
                        key={day}
                        style={{
                          flex: 1,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                        title={`Day ${day}: ₹${amount}`}
                      >
                        <div style={{
                          width: '100%',
                          height: `${Math.max(heightPct, 3)}%`,
                          background: isToday ? 'var(--accent-solid)' : 'var(--chart-bar-muted)',
                          borderRadius: '2px 2px 0 0',
                          transition: 'height 0.3s ease',
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  paddingTop: 4,
                }}>
                  <span>1</span>
                  {dailyBars.filter((_, i) => (i + 1) % 4 === 0 && (i + 1) < currentDay).map(d => (
                    <span key={d.day}>{d.day}</span>
                  ))}
                  <span>{currentDay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: By category (monochrome bars, ranked) */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">By category</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Share of ₹{monthTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {categoryRanking.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No category data for this month.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {categoryRanking.map(item => (
                  <div key={item.name}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      marginBottom: 6,
                    }}>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>
                        {item.name}
                      </span>
                      <span style={{
                        color: 'var(--text)',
                        fontWeight: 500,
                        fontFeatureSettings: '"tnum" 1',
                      }}>
                        ₹{item.amount.toLocaleString('en-IN')} <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{item.pct}%</span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      background: 'var(--surface-2)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        borderRadius: 3,
                        width: `${item.pct}%`,
                        background: 'var(--accent-solid)',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Card: Budget */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Budget</span>
              {monthlyBudget > 0 && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ₹{monthlyBudget.toLocaleString('en-IN')} a month
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text)',
                fontFeatureSettings: '"tnum" 1',
              }}>
                ₹{remainingBudget > 0 ? remainingBudget.toLocaleString('en-IN') : 0}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                left · {daysRemaining} days to go
              </span>
            </div>

            {/* 8px progress bar */}
            <div style={{
              width: '100%',
              height: 8,
              borderRadius: 4,
              background: 'var(--surface-2)',
              marginTop: 14,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 4,
                width: `${Math.min(budgetUsagePercent, 100)}%`,
                background: budgetUsagePercent > 90 ? 'var(--danger)' : 'var(--accent-solid)',
                transition: 'width 0.4s ease',
              }} />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: 8,
            }}>
              <span>₹{monthSpent.toLocaleString('en-IN')} spent</span>
              <span>₹{monthlyBudget > 0 ? monthlyBudget.toLocaleString('en-IN') : '—'}</span>
            </div>
          </div>

          {/* Card: Savings insights (Page 5 in PDF) */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Savings insights</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Insight 1: Run rate */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <TrendingUp size={16} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.45 }}>
                  {monthlyBudget > 0 ? (
                    projectedDifference >= 0 ? (
                      <>At ₹{dailyAvg} a day you are on track to finish {monthName} around ₹{projectedTotal.toLocaleString('en-IN')}, roughly <strong style={{ fontWeight: 600 }}>₹{projectedDifference.toLocaleString('en-IN')} under budget</strong>.</>
                    ) : (
                      <>At current spending of ₹{dailyAvg}/day, you may exceed your budget by ₹{Math.abs(projectedDifference).toLocaleString('en-IN')}.</>
                    )
                  ) : (
                    <>You spend an average of ₹{dailyAvg} each day this month.</>
                  )}
                </div>
              </div>

              {/* Insight 2: Category distribution */}
              {topCategory && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <AlertCircle size={16} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.45 }}>
                    {topCategory.name} is {topCategory.pct}% of your spending. Cutting it by a quarter would save about <strong style={{ fontWeight: 600 }}>₹{Math.round(topCategory.amount * 0.25).toLocaleString('en-IN')}</strong> so far this month.
                  </div>
                </div>
              )}

              {/* Insight 3: Zero-spending days */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Check size={16} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.45 }}>
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
