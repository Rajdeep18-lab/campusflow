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
  Food: '#C77726',
  Travel: '#4A7C59',
  Books: '#685B88',
  Hostel: '#B25D42',
  Mess: '#2F6B4F',
  Shopping: '#A85A75',
  Recharge: '#3C6E71',
  Entertainment: '#7D688D',
  Others: '#7A7568',
};

const CAT_EMOJIS = {
  Food: '🍲', Travel: '🚌', Books: '📚', Hostel: '🏠',
  Mess: '🍱', Shopping: '🛍️', Recharge: '📱', Entertainment: '🎬', Others: '💡',
};

/* ── SVG Donut Chart ── */
const DonutChart = ({ segments, size = 180, thickness = 28 }) => {
  const R = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * R;

  let cumulative = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) return null;

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="var(--border-base)"
        strokeWidth={thickness}
      />

      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = circumference * pct;
        const gap = circumference * (1 - pct);
        const offset = circumference * (1 - cumulative);
        cumulative += pct;

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={R}
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
    <div className="insight-icon" style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border-base)' }}>
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
        <span style={{
          fontSize: '0.6875rem', fontWeight: 700, color,
          background: `${color}18`, border: `1px solid ${color}35`,
          padding: '1px 7px', borderRadius: 20
        }}>
          {percentage}%
        </span>
        <span style={{
          fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)', minWidth: 75, textAlign: 'right', letterSpacing: '-0.015em'
        }}>
          ₹{amount.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
    <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
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
  const R = 44;
  const circ = 2 * Math.PI * R;
  const clampedPct = Math.min(percent, 100);
  const dashArr = `${(circ * clampedPct) / 100} ${circ}`;
  const color = clampedPct > 90 ? '#DC2626' : clampedPct > 70 ? '#D97706' : 'var(--accent)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border-base)" strokeWidth="10" />
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {clampedPct}%
          </div>
          <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 2 }}>USED</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
        {[
          { label: 'Budget Set', value: `₹${budget.toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
          { label: 'Spent', value: `₹${spent.toLocaleString('en-IN')}`, color },
          { label: 'Remaining', value: `₹${Math.max(remaining, 0).toLocaleString('en-IN')}`, color: remaining >= 0 ? 'var(--color-success)' : '#DC2626' },
        ].map(({ label, value, color: c }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: c }}>{value}</span>
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
  const hasAnyData = expenses.length > 0 || todos.length > 0;

  // Category totals
  const categoryTotals = useMemo(() =>
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {}),
    [expenses]
  );
  const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const totalSum = sortedCats.reduce((s, [, v]) => s + v, 0);

  // Average daily expense
  const todayStr = new Date().toISOString().split('T')[0];
  const monthStr = todayStr.substring(0, 7);
  const dayOfMonth = new Date().getDate();
  const avgDaily = dayOfMonth > 0 ? Math.round(monthlyExpensesTotal / dayOfMonth) : 0;
  const todaySpend = expenses.filter((e) => e.date === todayStr).reduce((s, e) => s + e.amount, 0);

  // Savings estimate
  const savings = monthlyBudget > 0 ? Math.max(monthlyBudget - monthlyExpensesTotal, 0) : 0;

  // Weekly spending
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const amt = expenses.filter((e) => e.date === str).reduce((s, e) => s + e.amount, 0);
      const lbl = d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3);
      days.push({ label: lbl, amount: amt, isToday: str === todayStr });
    }
    return days;
  }, [expenses, todayStr]);

  const weeklyMax = Math.max(...weeklyData.map((d) => d.amount), 1);

  // Donut segments
  const donutSegments = sortedCats.slice(0, 6).map(([cat, amount]) => ({
    name: cat,
    value: amount,
    color: CAT_COLORS[cat] || 'var(--text-muted)',
  }));

  // Auto-generated insights
  const insights = useMemo(() => {
    const list = [];

    if (sortedCats.length > 0) {
      const [topCat, topAmt] = sortedCats[0];
      const pct = totalSum > 0 ? Math.round((topAmt / totalSum) * 100) : 0;
      list.push({
        emoji: CAT_EMOJIS[topCat] || '📊',
        text: `You spent ${pct}% of your total on ${topCat}.`,
        subtext: `₹${topAmt.toLocaleString('en-IN')} out of ₹${totalSum.toLocaleString('en-IN')} total`,
      });
    }

    if (monthlyBudget > 0) {
      if (!isOverBudget) {
        list.push({
          emoji: '✅',
          text: 'You are within your monthly budget.',
          subtext: `₹${remainingBudget.toLocaleString('en-IN')} remaining (${100 - budgetUsagePercent}% left)`,
        });
      } else {
        list.push({
          emoji: '⚠️',
          text: 'You have exceeded your monthly budget!',
          subtext: `Over by ₹${(monthlyExpensesTotal - monthlyBudget).toLocaleString('en-IN')}`,
        });
      }
    }

    if (avgDaily > 0) {
      list.push({
        emoji: '📅',
        text: `Your average daily spend this month is ₹${avgDaily.toLocaleString('en-IN')}.`,
        subtext: `Computed from ${dayOfMonth} days in ${new Date().toLocaleString('en-IN', { month: 'long' })}`,
      });
    }

    if (todaySpend > 0) {
      list.push({
        emoji: todaySpend > avgDaily * 1.5 ? '🔥' : '💰',
        text: todaySpend > avgDaily * 1.5
          ? `Today's spending (₹${todaySpend.toLocaleString('en-IN')}) is above your average.`
          : `You've spent ₹${todaySpend.toLocaleString('en-IN')} today.`,
        subtext: `Your current average is ₹${avgDaily.toLocaleString('en-IN')}/day`,
      });
    }

    if (taskCompletionPercent >= 80 && totalTasksCount > 0) {
      list.push({
        emoji: '🏆',
        text: `Excellent! You have completed ${taskCompletionPercent}% of your tasks.`,
        subtext: `${completedTasksCount} done, ${pendingTasksCount} remaining`,
      });
    } else if (totalTasksCount > 0) {
      list.push({
        emoji: '📝',
        text: `You have ${pendingTasksCount} pending task${pendingTasksCount !== 1 ? 's' : ''}.`,
        subtext: `Completion rate is currently at ${taskCompletionPercent}%`,
      });
    }

    if (savings > 0) {
      list.push({
        emoji: '🐖',
        text: `You could save ₹${savings.toLocaleString('en-IN')} this month.`,
        subtext: 'Keep it up by maintaining your daily discipline!',
      });
    }

    return list.slice(0, 5);
  }, [
    sortedCats, totalSum, monthlyBudget, isOverBudget, remainingBudget,
    budgetUsagePercent, avgDaily, dayOfMonth, todaySpend,
    taskCompletionPercent, totalTasksCount, completedTasksCount,
    pendingTasksCount, savings, monthlyExpensesTotal,
  ]);

  const highTasks = todos.filter((t) => t.priority === 'High').length;
  const mediumTasks = todos.filter((t) => t.priority === 'Medium').length;
  const lowTasks = todos.filter((t) => t.priority === 'Low').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Analytics &amp; Insights
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Computed live from your local spending and task history.
        </p>
      </div>

      {!hasAnyData ? (
        <EmptyState
          icon={BarChart3}
          title="No data to visualize yet"
          description="Add some expenses or tasks — your analytics and charts will appear automatically."
        />
      ) : (
        <>
          {/* ── Metric Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {[
              {
                label: 'Monthly Expense',
                value: `₹${monthlyExpensesTotal.toLocaleString('en-IN')}`,
                sub: `${expenses.filter((e) => e.date?.startsWith(monthStr)).length} records`,
                icon: TrendingUp,
                isMono: true,
              },
              {
                label: 'Avg Daily Spend',
                value: `₹${avgDaily.toLocaleString('en-IN')}`,
                sub: `Over ${dayOfMonth} days`,
                icon: CalendarDays,
                isMono: true,
              },
              {
                label: 'Top Category',
                value: sortedCats[0]?.[0] || '—',
                sub: sortedCats[0] ? `${Math.round((sortedCats[0][1] / totalSum) * 100)}% of total` : 'No data',
                icon: Flame,
                isMono: false,
              },
              {
                label: 'Budget Left',
                value: monthlyBudget > 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : 'Not set',
                sub: monthlyBudget > 0 ? `${100 - budgetUsagePercent}% remaining` : 'Set in settings',
                icon: Wallet,
                isMono: true,
              },
              {
                label: 'Savings Est.',
                value: monthlyBudget > 0 ? `₹${savings.toLocaleString('en-IN')}` : '—',
                sub: monthlyBudget > 0 ? 'vs monthly budget' : 'Set a budget first',
                icon: PiggyBank,
                isMono: true,
              },
              {
                label: 'Task Progress',
                value: `${taskCompletionPercent}%`,
                sub: `${completedTasksCount} done / ${pendingTasksCount} left`,
                icon: CheckSquare,
                isMono: true,
              },
            ].map(({ label, value, sub, icon: Icon, isMono }) => (
              <div key={label} className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </span>
                  <div style={{
                    width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-subtle)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={14} />
                  </div>
                </div>
                <div style={{
                  fontFamily: isMono ? 'var(--font-mono)' : 'var(--font-heading)',
                  fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)',
                  letterSpacing: '-0.02em', lineHeight: 1.1,
                }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>

            {/* Donut Chart — Category Distribution */}
            {hasExpenseData && (
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Category Distribution</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Share of spending by category</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <DonutChart segments={donutSegments} size={150} thickness={22} />
                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
                    {donutSegments.map((seg) => (
                      <div key={seg.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {CAT_EMOJIS[seg.name]} {seg.name}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: seg.color, flexShrink: 0 }}>
                          {totalSum > 0 ? Math.round((seg.value / totalSum) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Spending Bar Chart */}
            {hasExpenseData && (
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Spending</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Daily spending over the last 7 days</div>
                  </div>
                </div>
                <div style={{ height: 110, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 10 }}>
                  {weeklyData.map(({ label, amount, isToday }, i) => {
                    const pct = weeklyMax > 0 ? (amount / weeklyMax) * 100 : 0;
                    return (
                      <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {amount > 0 ? `₹${amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : amount}` : ''}
                        </div>
                        <div style={{
                          width: '100%', minHeight: 4,
                          height: `${Math.max(pct, 6)}%`,
                          background: isToday ? 'var(--accent)' : 'var(--border-base)',
                          borderRadius: '4px 4px 0 0',
                          transition: `height 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`,
                        }} />
                        <div style={{
                          fontSize: '0.625rem', fontWeight: isToday ? 700 : 500,
                          color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                        }}>
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Budget Usage Ring */}
            {monthlyBudget > 0 && (
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Wallet size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Budget</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Tracking limits and consumption</div>
                  </div>
                </div>
                <div>
                  <BudgetRing
                    percent={budgetUsagePercent}
                    budget={monthlyBudget}
                    spent={monthlyExpensesTotal}
                    remaining={remainingBudget}
                  />
                  {/* Progress bar under ring */}
                  <div style={{ marginTop: 18 }}>
                    <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        width: `${Math.min(budgetUsagePercent, 100)}%`,
                        background: budgetUsagePercent > 90
                          ? '#DC2626'
                          : budgetUsagePercent > 70
                          ? '#D97706'
                          : 'var(--accent)',
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
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Flame size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Top Expense Categories</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Ranked by total spending</div>
                  </div>
                </div>
                <div style={{ paddingBottom: 4 }}>
                  {sortedCats.map(([cat, amount], i) => (
                    <CategoryBar
                      key={cat}
                      name={cat}
                      amount={amount}
                      percentage={totalSum > 0 ? Math.round((amount / totalSum) * 100) : 0}
                      color={CAT_COLORS[cat] || 'var(--text-muted)'}
                      emoji={CAT_EMOJIS[cat] || '💡'}
                      rank={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Task Performance */}
            {todos.length > 0 && (
              <div className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Award size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Task Performance</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Completion and priority distribution</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Completion bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <span>Completion Rate</span>
                      <span style={{ color: taskCompletionPercent >= 80 ? 'var(--color-success)' : 'var(--text-primary)' }}>
                        {completedTasksCount}/{totalTasksCount} done ({taskCompletionPercent}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', height: 8, borderRadius: 99, overflow: 'hidden', gap: 2 }}>
                      <div style={{
                        flex: completedTasksCount, background: 'var(--accent)',
                        transition: 'flex 1s cubic-bezier(0.16,1,0.3,1)',
                        minWidth: completedTasksCount > 0 ? 4 : 0,
                      }} />
                      <div style={{
                        flex: pendingTasksCount, background: 'var(--border-base)',
                        transition: 'flex 1s cubic-bezier(0.16,1,0.3,1)',
                        minWidth: pendingTasksCount > 0 ? 4 : 0,
                      }} />
                    </div>
                  </div>

                  {/* Priority breakdown */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Priority Distribution</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {[
                        { label: 'High', count: highTasks, color: '#DC2626' },
                        { label: 'Medium', count: mediumTasks, color: '#D97706' },
                        { label: 'Low', count: lowTasks, color: 'var(--accent)' },
                      ].map(({ label, count, color }) => (
                        <div
                          key={label}
                          style={{
                            padding: '10px 8px', borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color, marginBottom: 2 }}>{label}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{count}</div>
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
            <div className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-subtle)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lightbulb size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Smart Insights</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Generated from your activity patterns</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {insights.map((insight, i) => (
                  <InsightCard key={i} {...insight} delay={i * 0.05} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
