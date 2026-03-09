const CYCLE_MULTIPLIER = { MONTHLY: 1, YEARLY: 1 / 12 };
const round = (v) => Math.round(v * 100) / 100;

const getMonthlyAmount = (sub) => Number(sub.amount) * (CYCLE_MULTIPLIER[sub.billingCycle] || 1);

export const getSmartInsights = (subscriptions, user) => {
  const active = subscriptions.filter((s) => s.isActive);
  const monthlySpend = active.reduce((sum, s) => sum + getMonthlyAmount(s), 0);
  const budget = user?.budgetLimit != null ? Number(user.budgetLimit) : null;

  const insights = [];

  // Budget insights
  if (budget != null) {
    const remaining = budget - monthlySpend;
    const pct = Math.round((monthlySpend / budget) * 100);
    if (remaining < 0) {
      insights.push({
        type: "warning",
        title: "Over Budget",
        message: `You're ${Math.abs(remaining).toFixed(2)} over your monthly budget (${pct}% used). Consider pausing or canceling subscriptions.`
      });
    } else if (pct >= 90) {
      insights.push({
        type: "warning",
        title: "Near Budget Limit",
        message: `You've used ${pct}% of your budget. ${remaining.toFixed(2)} remaining this month.`
      });
    } else if (remaining > 0) {
      insights.push({
        type: "success",
        title: "On Track",
        message: `You have ${remaining.toFixed(2)} remaining in your budget this month.`
      });
    }
  } else {
    insights.push({
      type: "info",
      title: "Set a Budget",
      message: "Add a monthly budget limit to get smart over-budget alerts and stay on track."
    });
  }

  // Renewal insights
  const now = new Date();
  const in7Days = new Date(now);
  in7Days.setDate(now.getDate() + 7);
  const renewingSoon = active.filter((s) => {
    const d = new Date(s.nextBillingAt);
    return d >= now && d <= in7Days;
  });
  if (renewingSoon.length > 0) {
    insights.push({
      type: "info",
      title: "Renewals Coming Up",
      message: `${renewingSoon.length} subscription(s) renew in the next 7 days: ${renewingSoon.map((s) => s.name).join(", ")}.`
    });
  }

  // Usage & cost per use insights
  const withUsage = active.filter((s) => s.usesPerMonth != null && s.usesPerMonth > 0);
  if (withUsage.length > 0) {
    const expensive = withUsage
      .map((s) => ({
        ...s,
        costPerUse: getMonthlyAmount(s) / s.usesPerMonth
      }))
      .sort((a, b) => b.costPerUse - a.costPerUse);
    const worst = expensive[0];
    if (worst.costPerUse > getMonthlyAmount(worst) * 0.5) {
      insights.push({
        type: "info",
        title: "Low Usage Alert",
        message: `${worst.name} costs ${worst.costPerUse.toFixed(2)} per use. Consider if it's worth it or increase usage.`
      });
    }
  }

  // Subscription count
  if (active.length >= 10) {
    insights.push({
      type: "info",
      title: "Many Subscriptions",
      message: `You have ${active.length} active subscriptions. Review them regularly to avoid subscription creep.`
    });
  }

  return insights;
};

export const getHealthScore = (subscriptions, user) => {
  const active = subscriptions.filter((s) => s.isActive);
  const monthlySpend = active.reduce((sum, s) => sum + getMonthlyAmount(s), 0);
  const budget = user?.budgetLimit != null ? Number(user.budgetLimit) : null;

  let score = 70;
  const factors = [];

  if (budget != null && budget > 0) {
    const ratio = monthlySpend / budget;
    if (ratio <= 0.7) {
      score += 15;
      factors.push("Well under budget");
    } else if (ratio <= 1) {
      score += 5;
      factors.push("Within budget");
    } else {
      score -= 20;
      factors.push("Over budget");
    }
  }

  if (active.length <= 5) {
    score += 5;
    factors.push("Manageable subscription count");
  } else if (active.length > 15) {
    score -= 10;
    factors.push("High subscription count");
  }

  const withUsage = active.filter((s) => s.usesPerMonth != null && s.usesPerMonth > 0);
  if (withUsage.length > 0) {
    score += 5;
    factors.push("Usage tracking enabled");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    factors
  };
};

export const getUsageBreakdown = (subscriptions) => {
  const active = subscriptions.filter((s) => s.isActive);
  return active
    .filter((s) => s.usesPerMonth != null && s.usesPerMonth > 0)
    .map((s) => {
      const monthly = getMonthlyAmount(s);
      return {
        name: s.name,
        category: s.category,
        monthlyAmount: round(monthly),
        usesPerMonth: s.usesPerMonth,
        costPerUse: round(monthly / s.usesPerMonth)
      };
    })
    .sort((a, b) => b.costPerUse - a.costPerUse);
};

export const getFinancialForecast = (subscriptions, months = 12) => {
  const active = subscriptions.filter((s) => s.isActive);
  const monthlySpend = active.reduce((sum, s) => sum + getMonthlyAmount(s), 0);

  const forecast = [];
  const now = new Date();
  for (let i = 1; i <= months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    forecast.push({
      month: `${date.toLocaleString("default", { month: "short" })} '${String(date.getFullYear()).slice(2)}`,
      year: date.getFullYear(),
      amount: round(monthlySpend)
    });
  }

  return {
    monthlyAverage: round(monthlySpend),
    annualProjection: round(monthlySpend * 12),
    forecast
  };
};
