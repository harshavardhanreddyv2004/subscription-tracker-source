import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { subscriptionsApi } from "../api/subscriptionsApi";
import { formatCurrency } from "../utils/formatters";
import { useCurrencyStore } from "../store/useCurrencyStore";

const insightTypeStyles = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  info: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
};

export const SmartInsightsPage = () => {
  const currency = useCurrencyStore((s) => s.currency);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await subscriptionsApi.getSmartInsights();
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load insights");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-slate-200">Loading Smart Insights...</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-300">{error}</p>
    );
  }

  const { insights = [], healthScore = {}, forecast = {} } = data || {};

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">AI Smart Insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          Usage tracking, health score, budget system, and financial forecast
        </p>
      </div>

      {/* Subscription Health Score */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
        <h3 className="text-lg font-semibold text-white">Subscription Health Score</h3>
        <p className="mt-1 text-sm text-slate-400">
          Overall health of your subscription portfolio (0–100)
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div
            className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${
              healthScore.score >= 70
                ? "bg-emerald-500/20 text-emerald-400"
                : healthScore.score >= 50
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-rose-500/20 text-rose-400"
            }`}
          >
            {healthScore.score ?? "—"}
          </div>
          {healthScore.factors?.length > 0 && (
            <ul className="space-y-1 text-sm text-slate-300">
              {healthScore.factors.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Budget System */}
      {data?.budget && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
          <h3 className="text-lg font-semibold text-white">Budget System</h3>
          <p className="mt-1 text-sm text-slate-400">Monthly spending vs. budget limit</p>
          {data.budget.budgetLimit != null ? (
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">
                  {formatCurrency(data.budget.monthlySpend, currency)} of {formatCurrency(data.budget.budgetLimit, currency)}
                </span>
                <span className="text-slate-400">
                  {Math.round(
                    (Number(data.budget.monthlySpend) / Number(data.budget.budgetLimit)) * 100
                  )}
                  % used
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    data.budget.budgetStatus === "OVER_BUDGET"
                      ? "bg-rose-500"
                      : data.budget.budgetStatus === "UNDER_BUDGET"
                        ? "bg-emerald-500"
                        : "bg-cyan-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (Number(data.budget.monthlySpend) / Number(data.budget.budgetLimit)) * 100
                    )}%`
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {data.budget.budgetRemaining != null && (
                  <>
                    {data.budget.budgetRemaining >= 0 ? (
                      <span className="text-emerald-400">{formatCurrency(data.budget.budgetRemaining, currency)} remaining</span>
                    ) : (
                      <span className="text-rose-400">{formatCurrency(Math.abs(data.budget.budgetRemaining), currency)} over budget</span>
                    )}
                  </>
                )}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-slate-400">Set a budget on the Subscriptions page to track spending.</p>
          )}
        </div>
      )}

      {/* AI Smart Insights */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
        <h3 className="text-lg font-semibold text-white">AI Smart Insights</h3>
        <p className="mt-1 text-sm text-slate-400">Personalized recommendations based on your data</p>
        <div className="mt-4 space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-lg border p-4 ${insightTypeStyles[insight.type] || insightTypeStyles.info}`}
              >
                <p className="font-semibold">{insight.title}</p>
                <p className="mt-1 text-sm opacity-90">{insight.message}</p>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-slate-600 bg-slate-800/50 p-4 text-slate-400">
              Add subscriptions and set a budget to get personalized insights.
            </p>
          )}
        </div>
      </div>

      {/* Financial Forecast Simulator */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
        <h3 className="text-lg font-semibold text-white">Financial Forecast Simulator</h3>
        <p className="mt-1 text-sm text-slate-400">
          Projected spending based on current subscriptions (next 12 months)
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-600 bg-slate-800/50 p-4">
            <p className="text-xs uppercase text-slate-400">Monthly average</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(forecast.monthlyAverage, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-600 bg-slate-800/50 p-4">
            <p className="text-xs uppercase text-slate-400">Annual projection</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(forecast.annualProjection, currency)}
            </p>
          </div>
        </div>
        {forecast.forecast?.length > 0 && (
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast.forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `${v}`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value, currency)}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Usage Tracking + Cost Per Use (from insights) */}
      {data?.usageBreakdown?.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
          <h3 className="text-lg font-semibold text-white">Usage Tracking + Cost Per Use</h3>
          <p className="mt-1 text-sm text-slate-400">
            Subscriptions with usage tracked – cost per use
          </p>
          <ul className="mt-4 space-y-2">
            {data.usageBreakdown.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    {item.category} • {item.usesPerMonth} uses/mo
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">
                    {formatCurrency(item.costPerUse, currency)} per use
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatCurrency(item.monthlyAmount, currency)}/mo
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
