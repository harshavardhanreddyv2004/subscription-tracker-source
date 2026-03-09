import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { CURRENCIES, useCurrencyStore } from "../store/useCurrencyStore";

const navBase = "rounded-lg px-4 py-2 text-sm font-semibold transition";

const navClass = ({ isActive }) =>
  isActive
    ? `${navBase} bg-cyan-400 text-slate-950`
    : `${navBase} text-cyan-100 hover:bg-slate-800`;

export const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex-shrink-0">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Smart Insights</p>
            <h1 className="text-2xl font-bold text-white">Subscription Tracker</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <nav className="flex items-center gap-2">
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              <NavLink to="/insights" className={navClass}>
                Smart Insights
              </NavLink>
              <NavLink to="/subscriptions" className={navClass}>
                Subscriptions
              </NavLink>
            </nav>
            <div className="flex items-center gap-3 border-l border-slate-600 pl-3 sm:pl-4">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-400"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="max-w-[140px] truncate text-sm text-slate-400" title={user?.fullName || user?.email}>
                {user?.fullName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
