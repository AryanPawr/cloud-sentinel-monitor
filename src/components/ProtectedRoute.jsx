import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Wait for localStorage restore before deciding â€” avoids flash redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-slate-500 text-xs font-mono">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated â†’ send to login, remember where they came from
  if (!user) return <Navigate to="/login" replace />;

  // Authenticated â†’ render the child route
  return <Outlet />;
}
