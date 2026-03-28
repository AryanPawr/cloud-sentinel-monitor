import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";


const API_SERVICES = "/services";
const API_ALERTS   = "/alerts";

// â”€â”€ System health logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getSystemHealth(services, openAlerts) {
  const hasDownServices = services.some((s) => s.status === "DOWN");
  const hasP1Open       = openAlerts.some((a) => a.severity === "P1");

  if (hasDownServices || hasP1Open) {
    return {
      label: "System Degraded",
      sub:   hasP1Open ? "P1 incident active" : "Services unreachable",
      dot:   "bg-rose-500 animate-pulse",
      badge: "bg-rose-500/10 border-rose-500/30 text-rose-400",
      icon:  "text-rose-400",
    };
  }

  if (openAlerts.length > 0) {
    return {
      label: "Minor Warnings",
      sub:   `${openAlerts.length} open alert${openAlerts.length > 1 ? "s" : ""}`,
      dot:   "bg-amber-400 animate-pulse",
      badge: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      icon:  "text-amber-400",
    };
  }

  return {
    label: "All Systems Operational",
    sub:   "No incidents detected",
    dot:   "bg-emerald-400",
    badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    icon:  "text-emerald-400",
  };
}

// â”€â”€ Skeleton helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
      <div className="h-3 bg-slate-800 rounded animate-pulse w-1/3" />
      <div className="h-7 bg-slate-800 rounded animate-pulse w-1/2" />
      <div className="h-3 bg-slate-800 rounded animate-pulse w-2/3" />
    </div>
  );
}

function SkeletonListItem() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
      <div className="space-y-1.5 flex-1">
        <div className="h-3 bg-slate-800 rounded animate-pulse w-1/3" />
        <div className="h-2.5 bg-slate-800 rounded animate-pulse w-1/4" />
      </div>
      <div className="h-5 w-12 bg-slate-800 rounded-full animate-pulse" />
    </div>
  );
}

// â”€â”€ Severity config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const severityConfig = {
  P1: "bg-rose-500/15 text-rose-400 border-rose-500/40",
  P2: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  P3: "bg-slate-500/15 text-slate-400 border-slate-500/40",
};

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [alerts, setAlerts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // â”€â”€ Fetch both APIs concurrently â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // âœ… Promise.all â€” both requests fire simultaneously
        const [svcRes, alrtRes] = await Promise.all([
  axiosInstance.get(API_SERVICES),
  axiosInstance.get(API_ALERTS),
]);

        const svcArray  = svcRes.data.data;
        const alrtArray = alrtRes.data.data;

        if (!Array.isArray(svcArray) || !Array.isArray(alrtArray)) {
          throw new Error("Unexpected response format from server.");
        }

        setServices(svcArray);
        setAlerts(alrtArray);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // â”€â”€ Derived metrics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const upCount     = services.filter((s) => s.status === "UP").length;
  const downCount   = services.filter((s) => s.status === "DOWN").length;
  const openAlerts  = alerts.filter((a) => a.status === "Open");   // used in right column too
  const p1Count     = openAlerts.filter((a) => a.severity === "P1").length;
  const health      = getSystemHealth(services, openAlerts);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block w-2 h-2 rounded-full ${loading ? "bg-slate-600" : health.dot}`} />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            {loading ? "Connecting..." : "Live"}
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">
          Reliability Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Last updated: {new Date().toLocaleTimeString()} Â· Refreshes on mount
        </p>
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

      {/* â”€â”€ Top Stats Grid (3 cards) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading ? (
          [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {/* Card 1 â€” System Health */}
            <div className={`relative rounded-xl border ${health.badge} p-5 overflow-hidden group`}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${health.dot}`} />
                <span className="text-xs font-mono uppercase tracking-widest opacity-70">System Health</span>
              </div>
              <p className="text-xl font-bold text-slate-100 leading-tight mb-1">{health.label}</p>
              <p className="text-xs font-mono opacity-60">{health.sub}</p>
            </div>

            {/* Card 2 â€” Services */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Services</span>
              </div>
              <p className="text-3xl font-bold font-mono text-slate-100 mb-1">
                {upCount}
                <span className="text-slate-600 text-xl font-normal"> / {services.length}</span>
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {upCount} UP
                </span>
                {downCount > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {downCount} DOWN
                  </span>
                )}
              </div>
            </div>

            {/* Card 3 â€” Active Alerts */}
            <div className={`relative rounded-xl border p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200
              ${p1Count > 0 ? "border-rose-500/30 bg-rose-500/5" : "border-slate-800 bg-slate-900/60"}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Active Alerts</span>
              </div>
              <p className="text-3xl font-bold font-mono text-slate-100 mb-1">{openAlerts.length}</p>
              <div className="flex items-center gap-3 mt-2">
                {p1Count > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {p1Count} P1 Critical
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-500">No P1 incidents</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* â”€â”€ Bottom Split View â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left â€” Services list */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">All Services</h2>
            {!loading && (
              <span className="text-xs font-mono text-slate-500">{services.length} total</span>
            )}
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto max-h-80 divide-y divide-slate-800/60">
            {loading
              ? [...Array(5)].map((_, i) => <SkeletonListItem key={i} />)
              : services.length === 0
              ? (
                <div className="flex items-center justify-center py-12 text-slate-600 text-sm font-mono">
                  No services found
                </div>
              )
              : services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">{svc.name}</p>
                      <p className="text-xs font-mono text-slate-600 mt-0.5">{svc.region} Â· {svc.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {svc.responseTime !== null && svc.responseTime !== undefined && (
                        <span className="text-xs font-mono text-slate-600 hidden sm:inline">
                          {svc.responseTime} ms
                        </span>
                      )}
                      {svc.status === "UP" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          UP
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          DOWN
                        </span>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Right â€” Active Incidents (Open only) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Active Incidents</h2>
            {!loading && (
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border
                ${openAlerts.length > 0
                  ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                  : "text-slate-500 bg-slate-800 border-slate-700"
                }`}
              >
                {openAlerts.length} open
              </span>
            )}
          </div>

          {/* âœ… Only Open alerts â€” Resolved are filtered out */}
          <div className="overflow-y-auto max-h-80 divide-y divide-slate-800/60">
            {loading
              ? [...Array(3)].map((_, i) => <SkeletonListItem key={i} />)
              : openAlerts.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                  <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-mono">No active incidents</p>
                </div>
              )
              : openAlerts.map((alert) => {
                  const sevClass = severityConfig[alert.severity] ?? severityConfig.P3;
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between px-5 py-3 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-sm font-medium text-slate-200 truncate">{alert.title}</p>
                        <p className="text-xs font-mono text-slate-600 mt-0.5">
                          {alert.service} Â· {alert.duration}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border shrink-0 ${sevClass}`}>
                        {alert.severity}
                      </span>
                    </div>
                  );
                })}
          </div>
        </div>

      </div>
    </div>
  );
}
