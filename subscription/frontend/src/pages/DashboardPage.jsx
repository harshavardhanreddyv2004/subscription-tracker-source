import { useEffect } from "react";
import { SpendingChart } from "../components/SpendingChart";
import { StatCard } from "../components/StatCard";
import { useSubscriptionStore } from "../store/useSubscriptionStore";
import { useCurrencyStore } from "../store/useCurrencyStore";
import { formatCurrency } from "../utils/formatters";

export const DashboardPage = () => {
  const { fetchData, insights, loading, error } = useSubscriptionStore();
  const currency = useCurrencyStore((s) => s.currency);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !insights) {
    return <p className="text-slate-200">Loading dashboard...</p>;
  }

  return (
    <section className="space-y-5">
      {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-rose-300">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Subscriptions" value={insights?.activeCount ?? 0} />
        <StatCard label="Monthly Spend" value={formatCurrency(insights?.monthlySpend, currency)} />
        <StatCard label="Annual Projection" value={formatCurrency(insights?.annualProjection, currency)} />
        <StatCard
          label="Budget Status"
          value={insights?.budgetStatus === "OVER_BUDGET" ? "Over Budget" : "On Track"}
          helper={
            insights == null
              ? null
              : insights.budgetRemaining === null
                ? "Set a budget to track"
                : `${formatCurrency(Math.abs(insights.budgetRemaining), currency)} ${
                    insights.budgetRemaining < 0 ? "over" : "remaining"
                  }`
          }
          tone={insights?.budgetStatus === "OVER_BUDGET" ? "danger" : "success"}
        />
      </div>

      <SpendingChart data={insights?.categoryBreakdown ?? []} currency={currency} />
    </section>
  );
};
