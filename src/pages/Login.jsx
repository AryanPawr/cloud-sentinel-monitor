import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });

  // Already authenticated â€” skip straight to dashboard
  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // â”€â”€ Client-side validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const validate = () => {
    if (mode === "register" && form.name.trim().length < 2)
      return "Name must be at least 2 characters.";
    if (!form.email.includes("@"))
      return "Please enter a valid email address.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">

        {/* Logo + brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">CloudReliability</h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === "login" ? "Sign in to your dashboard" : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">

          {/* Mode tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-slate-800/60 rounded-lg">
            {[
              { key: "login",    label: "Sign In"  },
              { key: "register", label: "Register" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all
                  ${mode === key
                    ? "bg-slate-700 text-slate-100"
                    : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error banner â€” same rose-500 pattern as rest of app */}
          {error && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">

            {/* Name â€” register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5
                    text-sm text-slate-100 placeholder-slate-600 focus:outline-none
                    focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5
                  text-sm text-slate-100 placeholder-slate-600 focus:outline-none
                  focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-widest text-slate-500">
                  Password
                </label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors font-mono">
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5
                  text-sm text-slate-100 placeholder-slate-600 focus:outline-none
                  focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Submit â€” cyan-500 button, same as Services create button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400
                disabled:bg-cyan-500/40 text-slate-950 font-semibold text-sm py-2.5 rounded-lg
                transition-all duration-150 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Toggle hint */}
          <p className="text-center text-xs text-slate-600 mt-5">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 font-mono mt-6">
          CloudReliability Platform Â· v2.1.0
        </p>
      </div>
    </div>
  );
}
