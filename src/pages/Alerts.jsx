import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";


const API = "/alerts";

const severityConfig = {
  P1: {
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/40",
    dot: "bg-rose-500",
    row: "border-l-2 border-rose-500/60",
  },
  P2: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    dot: "bg-amber-400",
    row: "border-l-2 border-amber-500/60",
  },
  P3: {
    badge: "bg-slate-500/15 text-slate-400 border-slate-500/40",
    dot: "bg-slate-400",
    row: "border-l-2 border-slate-500/60",
  },
};

const statusConfig = {
  Open: {
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    dot: "bg-rose-400 animate-pulse",
  },
  Resolved: {
    badge: "bg-slate-700/60 text-slate-400 border-slate-600/40",
    dot: "bg-slate-500",
  },
};

function formatTimestamp(iso) {
  if (!iso) return "--";
  return new Date(iso).toLocaleString("en-AU", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800/50">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-slate-800 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Alerts() {
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [resolvingId, setResolvingId] = useState(null); // which row is mid-resolve
  const [deletingId, setDeletingId]   = useState(null); // which row is mid-delete

  // â”€â”€ Fetch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(API);

        // âœ… Backend returns { status, count, data: [...] }
        const arr = response.data.data;
        if (!Array.isArray(arr)) throw new Error("Unexpected response format.");
        setAlerts(arr);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch alerts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

// ── Resolve (PATCH /api/alerts/:id/resolve) ──────────────────────
  const handleResolve = async (alertData) => { // 1. Rename this to alertData
    if (alertData.status === "Resolved") return; 
    setResolvingId(alertData.id);
    try {
      // 2. Update the URL variable to match
      await axiosInstance.patch(`${API}/${alertData.id}/resolve`);
      
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertData.id ? { ...a, status: "Resolved" } : a))
      );
    } catch (err) {
      // 3. Now this standard alert() won't crash the app
      alert(err.response?.data?.message || "Failed to resolve alert.");
    } finally {
      setResolvingId(null);
    }
  };

  // â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this alert?")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`${API}/${id}`);
      // âœ… Remove from state â€” no reload
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete alert.");
    } finally {
      setDeletingId(null);
    }
  };

  const openCount = alerts.filter((a) => a.status === "Open").length;
  const p1Count   = alerts.filter((a) => a.severity === "P1" && a.status === "Open").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Loading..." : `${openCount} open | ${alerts.length - openCount} resolved`}
          </p>
        </div>

        {!loading && !error && (
          <div className="flex gap-3 text-sm font-mono">
            {p1Count > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                {p1Count} P1 Active
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {openCount} Open
            </div>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <p className="text-sm font-mono">No alerts found</p>
        </div>
      )}

      {/* Table */}
      {(loading || alerts.length > 0) && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Service", "Alert", "Severity", "Status", "Duration", "Triggered", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-mono uppercase tracking-widest text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                  : alerts.map((alert, i) => {
                      const sev        = severityConfig[alert.severity] ?? severityConfig.P3;
                      const sta        = statusConfig[alert.status]     ?? statusConfig.Resolved;
                      const isResolving = resolvingId === alert.id;
                      const isDeleting  = deletingId  === alert.id;
                      const isResolved  = alert.status === "Resolved";

                      return (
                        <tr
                          key={alert.id}
                          className={`border-b border-slate-800/50 transition-colors ${sev.row} ${
                            isDeleting ? "opacity-40" : "hover:bg-slate-800/40"
                          } ${i === alerts.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-6 py-4 font-medium text-slate-200">{alert.service}</td>
                          <td className="px-6 py-4 text-slate-400 max-w-xs">{alert.title}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border ${sev.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                              {alert.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border ${sta.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{alert.duration}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{formatTimestamp(alert.timestamp)}</td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">

                              {/* âœ… Resolve button â€” calls PATCH /alerts/:id/resolve */}
                              <button
                                onClick={() => handleResolve(alert)}
                                disabled={isResolved || isResolving}
                                title={isResolved ? "Already resolved" : "Mark as resolved"}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono
                                  border transition-all
                                  ${isResolved
                                    ? "text-slate-600 border-slate-700/40 cursor-not-allowed"
                                    : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                                  } ${isResolving ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {isResolving ? (
                                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                                {isResolved ? "Resolved" : "Resolve"}
                              </button>

                              {/* âœ… Delete button â€” calls DELETE /alerts/:id */}
                              <button
                                onClick={() => handleDelete(alert.id)}
                                disabled={isDeleting}
                                title="Delete alert"
                                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10
                                  border border-transparent hover:border-rose-500/30 transition-all disabled:opacity-40"
                              >
                                {isDeleting ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                )}
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-800">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="h-3 bg-slate-800 rounded animate-pulse w-1/2" />
                    <div className="h-3 bg-slate-800 rounded animate-pulse w-3/4" />
                  </div>
                ))
              : alerts.map((alert) => {
                  const sev         = severityConfig[alert.severity] ?? severityConfig.P3;
                  const sta         = statusConfig[alert.status]     ?? statusConfig.Resolved;
                  const isResolving = resolvingId === alert.id;
                  const isDeleting  = deletingId  === alert.id;
                  const isResolved  = alert.status === "Resolved";

                  return (
                    <div key={alert.id} className={`p-4 transition-colors ${sev.row} ${isDeleting ? "opacity-40" : "hover:bg-slate-800/40"}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-slate-200 text-sm">{alert.service}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{alert.title}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border shrink-0 ${sta.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                          {alert.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border ${sev.badge}`}>
                          {alert.severity}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{alert.duration}</span>
                        <span className="font-mono text-xs text-slate-600">{formatTimestamp(alert.timestamp)}</span>

                        {/* Mobile resolve */}
                        <button
                          onClick={() => handleResolve(alert)}
                          disabled={isResolved || isResolving}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono border transition-all
                            ${isResolved
                              ? "text-slate-600 border-slate-700/40 cursor-not-allowed"
                              : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                            }`}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {isResolved ? "Resolved" : "Resolve"}
                        </button>

                        {/* Mobile delete */}
                        <button
                          onClick={() => handleDelete(alert.id)}
                          disabled={isDeleting}
                          className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>

        </div>
      )}
    </div>
  );
}
