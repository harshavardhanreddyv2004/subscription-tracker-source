import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const RegisterPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      return;
    }

    const result = await register(email, fullName, password);
    if (result?.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Smart Insights</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Subscription Tracker</h1>
          <p className="mt-1 text-sm text-slate-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
              {error}
            </div>
          ) : null}
          {passwordMismatch ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
              Passwords do not match
            </div>
          ) : null}

          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-300">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="Jane Doe"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || passwordMismatch}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
