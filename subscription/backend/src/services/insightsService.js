const CYCLE_MULTIPLIER = {
  MONTHLY: 1,
  YEARLY: 1 / 12
};

const round = (value) => Math.round(value * 100) / 100;

export const calculateInsights = (subscriptions, budgetLimit = null) => {
  const active = subscriptions.filter((subscription) => subscription.isActive);

  const monthlySpend = active.reduce((sum, item) => {
    const amount = Number(item.amount);
    const multiplier = CYCLE_MULTIPLIER[item.billingCycle] || 1;
    return sum + amount * multiplier;
  }, 0);

  const categoryMap = active.reduce((acc, item) => {
    const amount = Number(item.amount) * (CYCLE_MULTIPLIER[item.billingCycle] || 1);
    acc[item.category] = (acc[item.category] || 0) + amount;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount: round(amount)
    }))
    .sort((a, b) => b.amount - a.amount);

  const usageBreakdown = active
    .filter((s) => s.usesPerMonth != null && s.usesPerMonth > 0)
    .map((s) => {
      const monthly = Number(s.amount) * (CYCLE_MULTIPLIER[s.billingCycle] || 1);
      return {
        name: s.name,
        category: s.category,
        monthlyAmount: round(monthly),
        usesPerMonth: s.usesPerMonth,
        costPerUse: round(monthly / s.usesPerMonth)
      };
    })
    .sort((a, b) => b.costPerUse - a.costPerUse);

  const annualProjection = monthlySpend * 12;
  const budget = budgetLimit === null ? null : Number(budgetLimit);
  const budgetRemaining = budget === null ? null : budget - monthlySpend;

  return {
    activeCount: active.length,
    monthlySpend: round(monthlySpend),
    annualProjection: round(annualProjection),
    budgetLimit: budget,
    budgetRemaining: budgetRemaining === null ? null : round(budgetRemaining),
    budgetStatus:
      budget === null
        ? "NO_BUDGET"
        : budgetRemaining >= 0
          ? "UNDER_BUDGET"
          : "OVER_BUDGET",
    categoryBreakdown,
    usageBreakdown
  };
};
