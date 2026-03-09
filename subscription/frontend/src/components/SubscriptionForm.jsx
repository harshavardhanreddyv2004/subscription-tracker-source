import { useEffect, useState } from "react";

const initialState = {
  name: "",
  category: "",
  amount: "",
  billingCycle: "MONTHLY",
  nextBillingAt: "",
  usesPerMonth: "",
  notes: ""
};

const toFormDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};

export const SubscriptionForm = ({ onSubmit, loading, editingItem, onCancel }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || "",
        category: editingItem.category || "",
        amount: String(editingItem.amount ?? ""),
        billingCycle: editingItem.billingCycle || "MONTHLY",
        nextBillingAt: toFormDate(editingItem.nextBillingAt),
        usesPerMonth: editingItem.usesPerMonth ? String(editingItem.usesPerMonth) : "",
        notes: editingItem.notes || ""
      });
    } else {
      setForm(initialState);
    }
  }, [editingItem]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      amount: Number(form.amount),
      usesPerMonth: form.usesPerMonth ? Number(form.usesPerMonth) : null,
      isActive: editingItem?.isActive ?? true
    };
    await onSubmit(editingItem ? { ...payload, id: editingItem.id } : payload);
    setForm(initialState);
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {editingItem ? "Edit Subscription" : "Add Subscription"}
        </h3>
        {editingItem && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
      <input
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        placeholder="Name (e.g. Netflix)"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        placeholder="Category (e.g. Entertainment)"
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      />
      <input
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        placeholder="Amount"
        type="number"
        step="0.01"
        min="0"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <select
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        name="billingCycle"
        value={form.billingCycle}
        onChange={handleChange}
      >
        <option value="MONTHLY">Monthly</option>
        <option value="YEARLY">Yearly</option>
      </select>
      <input
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        type="date"
        name="nextBillingAt"
        value={form.nextBillingAt}
        onChange={handleChange}
        required
      />
      <input
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        placeholder="Uses per month (optional, for cost per use)"
        type="number"
        min="1"
        name="usesPerMonth"
        value={form.usesPerMonth}
        onChange={handleChange}
      />
      <textarea
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-400"
        placeholder="Notes (optional)"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        rows={3}
      />
      <button
        disabled={loading}
        className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
      >
        {loading ? "Saving..." : editingItem ? "Update Subscription" : "Create Subscription"}
      </button>
    </form>
  );
};
