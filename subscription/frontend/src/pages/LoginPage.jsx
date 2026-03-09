import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const LoginPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result?.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Smart Insights</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Subscription Tracker</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
              {error}
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
