import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  CheckSquare,
  Lightbulb,
  PiggyBank,
  CalendarDays,
  Flame,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

/* ── Category Config ── */
const CAT_COLORS = {
  Food: '#10b981', Travel: '#06b6d4', Books: '#3b82f6',
  Hostel: '#8b5cf6', Mess: '#ec4899', Shopping: '#f59e0b',
  Recharge: '#14b8a6', Entertainment: '#6366f1', Others: '#64748b',
};
const CAT_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

/* ── SVG Donut Chart ── */
const DonutChart = ({ segments, size = 180, thickness = 28 }) => {
  const R   = (size - thickness) / 2;
  const cx  = size / 2;
  const cy  = size / 2;
  const circumference = 2 * Math.PI * R;

  let cumulative = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) return null;

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />

      {segments.map((seg, i) => {
        const pct    = seg.value / total;
        const dash   = circumference * pct;
        const gap    = circumference * (1 - pct);
        const offset = circumference * (1 - cumulative);
        cumulative  += pct;

        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness - 2}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: `stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
            }}
          />
        );
      })}
    </svg>
  );
};

/* ── Insight Card ── */
const InsightCard = ({ emoji, text, subtext, delay = 0 }) => (
  <div className="insight-card" style={{ animationDelay: `${delay}s` }}>
    <div className="insight-icon" style={{ background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}>
      {emoji}
    </div>
    <div>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45, margin: 0 }}>
        {text}
      </p>
      {subtext && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtext}</p>
      )}
    </div>
  </div>
);

/* ── Category Bar Row ── */
const CategoryBar = ({ name, amount, percentage, color, emoji, rank }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.875rem' }}>{emoji}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color, background: `${color}15`, border: `1px solid ${color}30`, padding: '1px 6px', borderRadius: 20 }}>{percentage}%</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', minWidth: 75, textAlign: 'right', letterSpacing: '-0.015em' }}>
          ₹{amount.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
    <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 99,
        background: color,
        width: `${percentage}%`,
        transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${rank * 0.06}s`,
      }} />
    </div>
  </div>
);

/* ── Budget Ring ── */
const BudgetRing = ({ percent, budget, spent, remaining }) => {
  const R   = 44;
  const circ = 2 * Math.PI * R;
  const clampedPct = Math.min(percent, 100);
  const dashArr = `${(circ * clampedPct) / 100} ${circ}`;
  const color = clampedPct > 90 ? '#ef4444' : clampedPct > 70 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={R} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={dashArr}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            className="budget-ring-circle"
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {clampedPct}%
          </div>
          <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>USED</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'Budget Set', value: `₹${budget.toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
          { label: 'Spent', value: `₹${spent.toLocaleString('en-IN')}`, color },
          { label: 'Remaining', value: `₹${Math.max(remaining, 0).toLocaleString('en-IN')}`, color: remaining >= 0 ? '#10b981' : '#ef4444' },
        ].map(({ label, value, color: c }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: c }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Analytics View ── */
export const AnalyticsView = () => {
  const {
    expenses,
    todos,
    monthlyBudget,
    monthlyExpensesTotal,
    budgetUsagePercent,
    remainingBudget,
    completedTasksCount,
    pendingTasksCount,
    totalTasksCount,
    taskCompletionPercent,
    isOverBudget,
  } = useApp();

  const hasExpenseData = expenses.length > 0;
  const hasAnyData     = expenses.length > 0 || todos.length > 0;

  // Category totals
  const categoryTotals = useMemo(() =>
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {}),
    [expenses]
  );
  const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const totalSum   = sortedCats.reduce((s, [, v]) => s + v, 0);

  // Average daily expense (month)
  const todayStr   = new Date().toISOString().split('T')[0];
  const monthStr   = todayStr.substring(0, 7);
  const dayOfMonth = new Date().getDate();
  const avgDaily   = dayOfMonth > 0 ? Math.round(monthlyExpensesTotal / dayOfMonth) : 0;
  const todaySpend = expenses.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0);

  // Savings estimate (budget - spent; show 0 if no budget)
  const savings = monthlyBudget > 0 ? Math.max(monthlyBudget - monthlyExpensesTotal, 0) : 0;

  // Weekly spending (last 7 days)
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d   = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const amt = expenses.filter(e => e.date === str).reduce((s, e) => s + e.amount, 0);
      const lbl = d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2);
      days.push({ label: lbl, amount: amt, isToday: str === todayStr });
    }
    return days;
  }, [expenses, todayStr]);

  const weeklyMax = Math.max(...weeklyData.map(d => d.amount), 1);

  // Donut segments
  const donutSegments = sortedCats.slice(0, 6).map(([cat, amount]) => ({
    name: cat, value: amount, color: CAT_COLORS[cat] || '#64748b',
  }));

  // Auto-generated insights
  const insights = useMemo(() => {
    const list = [];

    if (sortedCats.length > 0) {
      const [topCat, topAmt] = sortedCats[0];
      const pct = totalSum > 0 ? Math.round((topAmt / totalSum) * 100) : 0;
      list.push({
        emoji: CAT_EMOJIS[topCat] || '📊',
        text: `You spent ${pct}% of your money on ${topCat}.`,
        subtext: `₹${topAmt.toLocaleString('en-IN')} out of ₹${totalSum.toLocaleString('en-IN')} total`,
      });
    }

    if (monthlyBudget > 0) {
      if (!isOverBudget) {
        list.push({
          emoji: '✅',
          text: `You are within your monthly budget.`,
          subtext: `₹${remainingBudget.toLocaleString('en-IN')} remaining (${100 - budgetUsagePercent}% left)`,
        });
      } else {
        list.push({
          emoji: '⚠️',
          text: `You have exceeded your monthly budget!`,
          subtext: `Over by ₹${(monthlyExpensesTotal - monthlyBudget).toLocaleString('en-IN')}`,
        });
      }
    }

    if (avgDaily > 0) {
      list.push({
        emoji: '📅',
        text: `Your average daily spend this month is ₹${avgDaily.toLocaleString('en-IN')}.`,
        subtext: `Based on ${dayOfMonth} days of data`,
      });
    }

    if (todaySpend > 0) {
      list.push({
        emoji: todaySpend > avgDaily * 1.5 ? '🔥' : '💰',
        text: todaySpend > avgDaily * 1.5
          ? `Today's spending (₹${todaySpend.toLocaleString('en-IN')}) is above your daily average.`
          : `You've spent ₹${todaySpend.toLocaleString('en-IN')} today.`,
        subtext: `Your average is ₹${avgDaily.toLocaleString('en-IN')}/day`,
      });
    }

    if (taskCompletionPercent >= 80 && totalTasksCount > 0) {
      list.push({
        emoji: '🏆',
        text: `Excellent! You've completed ${taskCompletionPercent}% of your tasks.`,
        subtext: `${completedTasksCount} done, ${pendingTasksCount} remaining`,
      });
    } else if (totalTasksCount > 0) {
      list.push({
        emoji: '📝',
        text: `You have ${pendingTasksCount} pending task${pendingTasksCount !== 1 ? 's' : ''}.`,
        subtext: `Completion rate: ${taskCompletionPercent}%`,
      });
    }

    if (savings > 0) {
      list.push({
        emoji: '🐖',
        text: `You could save ₹${savings.toLocaleString('en-IN')} this month.`,
        subtext: 'Keep it up — stay within budget!',
      });
    }

    return list.slice(0, 5);
  }, [sortedCats, totalSum, monthlyBudget, isOverBudget, remainingBudget, budgetUsagePercent,
      avgDaily, dayOfMonth, todaySpend, taskCompletionPercent, totalTasksCount,
      completedTasksCount, pendingTasksCount, savings, monthlyExpensesTotal]);

  const highTasks   = todos.filter(t => t.priority === 'High').length;
  const mediumTasks = todos.filter(t => t.priority === 'Medium').length;
  const lowTasks    = todos.filter(t => t.priority === 'Low').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Analytics &amp; Insights
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Computed from your local data in real-time.
        </p>
      </div>

      {!hasAnyData ? (
        <EmptyState
          icon={BarChart3}
          title="No data to visualize yet"
          description="Add some expenses or tasks — your analytics will appear automatically."
        />
      ) : (
        <>
          {/* ── Overview Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {[
              {
                label: 'Monthly Expense',
                value: `₹${monthlyExpensesTotal.toLocaleString('en-IN')}`,
                sub: `${expenses.filter(e => e.date?.startsWith(monthStr)).length} transactions`,
                icon: TrendingUp, iconBg: 'rgba(16,185,129,0.1)', iconColor: 'var(--color-success)',
                delay: 0,
              },
              {
                label: 'Avg Daily Spend',
                value: `₹${avgDaily.toLocaleString('en-IN')}`,
                sub: `Over ${dayOfMonth} days`,
                icon: CalendarDays, iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6',
                delay: 0.05,
              },
              {
                label: 'Top Category',
                value: sortedCats[0]?.[0] || '—',
                sub: sortedCats[0] ? `${Math.round((sortedCats[0][1] / totalSum) * 100)}% of spending` : 'No data',
                icon: Flame, iconBg: 'rgba(239,68,68,0.1)', iconColor: 'var(--color-danger)',
                delay: 0.10,
              },
              {
                label: 'Budget Left',
                value: monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Not set',
                sub: monthlyBudget > 0 ? `${100 - budgetUsagePercent}% remaining` : 'Set a budget',
                icon: Wallet, iconBg: 'rgba(139,92,246,0.1)', iconColor: '#8b5cf6',
                delay: 0.15,
              },
              {
                label: 'Savings Est.',
                value: monthlyBudget > 0 ? `₹${savings.toLocaleString('en-IN')}` : '—',
                sub: monthlyBudget > 0 ? 'vs monthly budget' : 'Set a budget first',
                icon: PiggyBank, iconBg: 'rgba(20,184,166,0.1)', iconColor: '#14b8a6',
                delay: 0.20,
              },
              {
                label: 'Task Progress',
                value: `${taskCompletionPercent}%`,
                sub: `${completedTasksCount} done / ${pendingTasksCount} pending`,
                icon: CheckSquare, iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366f1',
                delay: 0.25,
              },
            ].map(({ label, value, sub, icon: Icon, iconBg, iconColor, delay }) => (
              <div
                key={label}
                className="stat-card animate-fade-in"
                style={{ animationDelay: `${delay}s` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="stat-label">{label}</span>
                  <div className="stat-icon-box" style={{ background: iconBg }}>
                    <Icon size={16} color={iconColor} strokeWidth={2} />
                  </div>
                </div>
                <div className="stat-value">{value}</div>
                <div className="stat-sub">{sub}</div>
              </div>
            ))}
          </div>

          {/* ── Charts Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>

            {/* Donut Chart — Category Distribution */}
            {hasExpenseData && (
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>🍩</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>Category Distribution</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>Where your money goes</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <DonutChart segments={donutSegments} size={160} thickness={24} />
                    {/* Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
                      {donutSegments.map(seg => (
                        <div key={seg.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {CAT_EMOJIS[seg.name]} {seg.name}
                          </span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: seg.color, flexShrink: 0 }}>
                            {totalSum > 0 ? Math.round((seg.value / totalSum) * 100) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Spending Bar Chart */}
            {hasExpenseData && (
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart3 size={15} color="#3b82f6" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>Weekly Spending</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>Last 7 days</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ height: 100, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                    {weeklyData.map(({ label, amount, isToday }, i) => {
                      const pct = weeklyMax > 0 ? (amount / weeklyMax) * 100 : 0;
                      return (
                        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {amount > 0 ? `₹${amount >= 1000 ? `${(amount/1000).toFixed(1)}k` : amount}` : ''}
                          </div>
                          <div style={{
                            width: '100%', minHeight: 4,
                            height: `${Math.max(pct, 5)}%`,
                            background: isToday
                              ? 'linear-gradient(180deg, #10b981, #059669)'
                              : 'rgba(16,185,129,0.2)',
                            borderRadius: '3px 3px 0 0',
                            border: isToday ? '1px solid rgba(16,185,129,0.4)' : 'none',
                            transition: `height 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`,
                          }} />
                          <div style={{
                            fontSize: '0.5625rem', fontWeight: isToday ? 700 : 500,
                            color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                          }}>
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Budget Usage Ring */}
            {monthlyBudget > 0 && (
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wallet size={15} color="#8b5cf6" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>Budget Usage</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>Monthly spend vs budget</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <BudgetRing
                    percent={budgetUsagePercent}
                    budget={monthlyBudget}
                    spent={monthlyExpensesTotal}
                    remaining={remainingBudget}
                  />
                  {/* Progress bar under ring */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        width: `${Math.min(budgetUsagePercent, 100)}%`,
                        background: budgetUsagePercent > 90
                          ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                          : 'linear-gradient(90deg, #10b981, #059669)',
                        transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      <span>₹0</span>
                      <span>₹{monthlyBudget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spending by Category (horizontal bars) */}
            {hasExpenseData && (
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={15} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>Top Spending Categories</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>Ranked by amount</div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ paddingBottom: 8 }}>
                  {sortedCats.map(([cat, amount], i) => (
                    <CategoryBar
                      key={cat}
                      name={cat}
                      amount={amount}
                      percentage={totalSum > 0 ? Math.round((amount / totalSum) * 100) : 0}
                      color={CAT_COLORS[cat] || '#64748b'}
                      emoji={CAT_EMOJIS[cat] || '💡'}
                      rank={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Task breakdown */}
            {todos.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={15} color="#6366f1" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>Task Performance</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>Priority &amp; completion analysis</div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Completion bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <span>Completion Rate</span>
                      <span style={{ color: taskCompletionPercent >= 80 ? 'var(--color-success)' : 'var(--text-primary)' }}>
                        {completedTasksCount}/{totalTasksCount} done
                      </span>
                    </div>
                    <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', gap: 1 }}>
                      <div style={{
                        flex: completedTasksCount, background: 'linear-gradient(90deg, #10b981, #059669)',
                        transition: 'flex 1s cubic-bezier(0.16,1,0.3,1)',
                        minWidth: completedTasksCount > 0 ? 4 : 0,
                      }} />
                      <div style={{
                        flex: pendingTasksCount, background: 'rgba(245,158,11,0.3)',
                        transition: 'flex 1s cubic-bezier(0.16,1,0.3,1)',
                        minWidth: pendingTasksCount > 0 ? 4 : 0,
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 7, fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981', display: 'inline-block' }} />
                        Done ({taskCompletionPercent}%)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(245,158,11,0.6)', display: 'inline-block' }} />
                        Pending ({100 - taskCompletionPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Priority distribution */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Priority Distribution</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {[
                        { label: 'High',   count: highTasks,   color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
                        { label: 'Medium', count: mediumTasks, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                        { label: 'Low',    count: lowTasks,    color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
                      ].map(({ label, count, color, bg, border }) => (
                        <div key={label} style={{ padding: '12px 8px', borderRadius: 'var(--radius-md)', background: bg, border: `1px solid ${border}`, textAlign: 'center' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color, marginBottom: 4 }}>{label}</div>
                          <div style={{ fontSize: '1.375rem', fontWeight: 800, color, letterSpacing: '-0.03em' }}>{count}</div>
                          <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {totalTasksCount > 0 ? `${Math.round((count / totalTasksCount) * 100)}%` : '0%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Smart Insights Panel ── */}
          {insights.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lightbulb size={15} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>Smart Insights</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 1 }}>Auto-generated from your data</div>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {insights.map((insight, i) => (
                  <InsightCard key={i} {...insight} delay={i * 0.06} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
