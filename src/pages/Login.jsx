import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axiosClient";
import TallyDot from "../components/TallyDot";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(identifier, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <TallyDot />
          <span className="font-display text-xl font-bold text-ink">
            WE<span className="text-accent">·</span>TUBE
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-surface p-6"
        >
          <h1 className="mb-1 font-display text-lg font-semibold text-ink">
            Log in
          </h1>
          <p className="mb-6 text-sm text-muted">
            Sign in to watch and upload broadcasts.
          </p>

          {error && (
            <p className="mb-4 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent">
              {error}
            </p>
          )}

          <label className="mb-1 block text-xs font-mono text-muted">
            USERNAME OR EMAIL
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mb-4 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            autoComplete="username"
          />

          <label className="mb-1 block text-xs font-mono text-muted">
            PASSWORD
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Log in"}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            New here?{" "}
            <Link to="/register" className="text-accent hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
