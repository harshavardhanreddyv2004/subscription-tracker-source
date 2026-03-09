import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../utils/formatters";

// Complementary/opposite colors for clear contrast between slices
const COLORS = [
  "#06b6d4", // cyan
  "#f97316", // orange (opposite of cyan)
  "#10b981", // emerald
  "#f43f5e", // rose (opposite of green)
  "#8b5cf6", // violet
  "#eab308"  // amber (opposite of purple)
];

export const SpendingChart = ({ data, currency = "USD" }) => {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Category Breakdown</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={110} label>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value, currency)}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data?.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-slate-700 pt-4">
          {data.map((entry, index) => (
            <li
              key={entry.category}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="flex-1 pl-3 font-medium text-white">{entry.category}</span>
              <span className="text-slate-300">{formatCurrency(entry.amount, currency)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
