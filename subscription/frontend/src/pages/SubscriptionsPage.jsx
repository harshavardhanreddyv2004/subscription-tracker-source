import { useEffect, useState } from "react";
import { SubscriptionForm } from "../components/SubscriptionForm";
import { SubscriptionTable } from "../components/SubscriptionTable";
import { useSubscriptionStore } from "../store/useSubscriptionStore";
import { useCurrencyStore } from "../store/useCurrencyStore";
import { formatCurrency } from "../utils/formatters";

export const SubscriptionsPage = () => {
  const currency = useCurrencyStore((s) => s.currency);
  const {
    fetchData,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    setBudgetLimit,
    subscriptions,
    loading,
    error,
    insights
  } = useSubscriptionStore();
  const [budgetInput, setBudgetInput] = useState("");
  const [editingSubscription, setEditingSubscription] = useState(null);

  const handleSubmit = async (payload) => {
    if (payload.id) {
      const { id, ...data } = payload;
      await updateSubscription(id, data);
      setEditingSubscription(null);
    } else {
      await createSubscription(payload);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetBudget = async (event) => {
    event.preventDefault();
    await setBudgetLimit(Number(budgetInput));
    setBudgetInput("");
  };

  return (
    <section className="space-y-5">
      {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-rose-300">{error}</p> : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr]">
        <SubscriptionForm
          onSubmit={handleSubmit}
          loading={loading}
          editingItem={editingSubscription}
          onCancel={() => setEditingSubscription(null)}
        />

        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
          <h3 className="text-lg font-semibold text-white">Budget Limit</h3>
          <p className="mt-1 text-sm text-slate-300">Set your monthly spending cap for smart over-budget alerts.</p>
          <form className="mt-4 flex flex-wrap items-center gap-2" onSubmit={handleSetBudget}>
            <input
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
              type="number"
              min="0"
              step="0.01"
              value={budgetInput}
              onChange={(event) => setBudgetInput(event.target.value)}
              placeholder="Enter monthly budget"
              required
            />
            <button
              disabled={loading}
              className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
            >
              Save Budget
            </button>
          </form>
          <p className="mt-3 text-sm text-slate-300">
            Current budget: {insights?.budgetLimit != null ? formatCurrency(insights.budgetLimit, currency) : "Not set"}
          </p>
        </div>
      </div>

      <SubscriptionTable
        subscriptions={subscriptions}
        loading={loading}
        onDelete={deleteSubscription}
        onEdit={setEditingSubscription}
        currency={currency}
      />
    </section>
  );
};
