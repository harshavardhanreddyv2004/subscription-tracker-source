import { formatCurrency, formatDate } from "../utils/formatters";

const getMonthlyAmount = (item) => {
  const amt = Number(item.amount);
  return item.billingCycle === "YEARLY" ? amt / 12 : amt;
};

export const SubscriptionTable = ({ subscriptions, onDelete, onEdit, loading, currency = "USD" }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr className="text-left text-xs uppercase tracking-[0.15em] text-slate-300">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Cost/Use</th>
            <th className="px-4 py-3">Cycle</th>
            <th className="px-4 py-3">Next Bill</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm text-slate-100">
          {subscriptions.map((item) => {
            const monthly = getMonthlyAmount(item);
            const costPerUse = item.usesPerMonth > 0 ? monthly / item.usesPerMonth : null;
            return (
            <tr key={item.id}>
              <td className="px-4 py-3 font-semibold">{item.name}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">{formatCurrency(item.amount, currency)}</td>
              <td className="px-4 py-3 text-slate-400">
                {costPerUse != null ? formatCurrency(costPerUse, currency) : "—"}
              </td>
              <td className="px-4 py-3">{item.billingCycle}</td>
              <td className="px-4 py-3">{formatDate(item.nextBillingAt)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    item.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {item.isActive ? "Active" : "Paused"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {onEdit && (
                    <button
                      disabled={loading}
                      className="rounded-md border border-cyan-500/60 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                      onClick={() => onEdit(item)}
                      type="button"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    disabled={loading}
                    className="rounded-md border border-rose-500/60 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={() => onDelete(item.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
          })}
          {subscriptions.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-slate-300" colSpan={8}>
                No subscriptions yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};
