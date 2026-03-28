import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

const API = "/services";

const typeColors = {
  API:      "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  Database: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  Worker:   "text-amber-400 bg-amber-500/10 border-amber-500/30",
  CDN:      "text-sky-400 bg-sky-500/10 border-sky-500/30",
  Service:  "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  Storage:  "text-teal-400 bg-teal-500/10 border-teal-500/30",
};

const EMPTY_FORM = {
  name: "",
  status: "UP",
  responseTime: "",
  region: "",
  type: "API",
};

// ── Sub-components ─────────────────────────────────────────────────

function ResponseBar({ ms }) {
  if (ms === null || ms === undefined)
    return <span className="text-slate-600 font-mono text-sm">-- timeout</span>;
  const pct   = Math.min((ms / 350) * 100, 100);
  const color = ms < 80 ? "bg-emerald-400" : ms < 200 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm text-slate-200 w-14 shrink-0">{ms} ms</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800/50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-slate-800 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function Input({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm
          text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60
          focus:ring-1 focus:ring-cyan-500/30 transition-all"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm
          text-slate-100 focus:outline-none focus:border-cyan-500/60 focus:ring-1
          focus:ring-cyan-500/30 transition-all"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-slate-900">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Create Service Modal ───────────────────────────────────────────

function CreateModal({ onClose, onCreated }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.region.trim()) {
      setError("Name and Region are required.");
      return;
    }

    // SCOPE FIX: defined before the try/catch block
    const payload = {
      ...form,
      responseTime: form.responseTime !== "" ? Number(form.responseTime) : null,
    };

    try {
      setSaving(true);
      setError(null);
      const response = await axiosInstance.post(API, payload);

      // Backend returns { status, data: { ...newService } }
      onCreated(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal card — stop click bubbling to backdrop */}
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-slate-100">Create Service</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <Input label="Name"          name="name"         value={form.name}         onChange={handleChange} placeholder="e.g. Auth Service" />
          <Input label="Region"        name="region"       value={form.region}       onChange={handleChange} placeholder="e.g. us-east-1" />
          <Input label="Response Time (ms)" name="responseTime" value={form.responseTime} onChange={handleChange} type="number" placeholder="e.g. 120" />
          <Select label="Type"   name="type"   value={form.type}   onChange={handleChange} options={["API", "Database", "Worker", "CDN", "Service", "Storage"]} />
          <Select label="Status" name="status" value={form.status} onChange={handleChange} options={["UP", "DOWN"]} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm
              hover:border-slate-600 hover:text-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/40
              text-slate-950 font-semibold text-sm transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : "Create Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function Services() {
  const [services, setServices]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [togglingId, setTogglingId]   = useState(null); // track which row is mid-toggle
  const [deletingId, setDeletingId]   = useState(null); // track which row is mid-delete

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        // FETCH FIX: Changed from .post(API, payload) to .get(API)
        const response = await axiosInstance.get(API);
        const arr = response.data.data;
        if (!Array.isArray(arr)) throw new Error("Unexpected response format.");
        setServices(arr);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ── Create ───────────────────────────────────────────────────────
  const handleCreated = (newService) => {
    setServices((prev) => [...prev, newService]);
  };

  // ── Toggle Status ────────────────────────────────────────────────
  const handleToggleStatus = async (svc) => {
    const newStatus = svc.status === "UP" ? "DOWN" : "UP";
    setTogglingId(svc.id);
    try {
      await axiosInstance.put(`${API}/${svc.id}`, { status: newStatus });
      // Update only the changed service in state — no reload
      setServices((prev) =>
        prev.map((s) => (s.id === svc.id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`${API}/${id}`);
      // Filter out deleted service from state — no reload
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete service.");
    } finally {
      setDeletingId(null);
    }
  };

  const upCount   = services.filter((s) => s.status === "UP").length;
  const downCount = services.filter((s) => s.status === "DOWN").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8">

      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Services</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Loading..." : `Monitoring ${services.length} registered services`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status pills */}
          {!loading && !error && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {upCount} UP
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {downCount} DOWN
              </div>
            </>
          )}

          {/* Create button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400
              text-slate-950 font-semibold text-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Service
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
          </svg>
          <p className="text-sm font-mono mb-4">No services found</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all"
          >
            Add your first service
          </button>
        </div>
      )}

      {/* Table */}
      {(loading || services.length > 0) && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Service", "Type", "Status", "Response Time", "Region", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-mono uppercase tracking-widest text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  : services.map((svc, i) => {
                      const isToggling = togglingId === svc.id;
                      const isDeleting = deletingId === svc.id;
                      return (
                        <tr
                          key={svc.id}
                          className={`border-b border-slate-800/50 transition-colors ${
                            isDeleting ? "opacity-40" : "hover:bg-slate-800/40"
                          } ${i === services.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-6 py-4 font-medium text-slate-100">{svc.name}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${typeColors[svc.type] ?? "text-slate-400 bg-slate-500/10 border-slate-500/30"}`}>
                              {svc.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {/* Clickable status badge — calls PUT API on click */}
                            <button
                              onClick={() => handleToggleStatus(svc)}
                              disabled={isToggling}
                              title="Click to toggle status"
                              className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold
                                px-2 py-1 rounded-lg border transition-all
                                ${svc.status === "UP"
                                  ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                  : "text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                                } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {isToggling ? (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                              ) : (
                                <span className={`w-1.5 h-1.5 rounded-full ${svc.status === "UP" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                              )}
                              {svc.status}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <ResponseBar ms={svc.responseTime} />
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{svc.region}</td>
                          <td className="px-6 py-4">
                            {/* Delete button — calls DELETE API */}
                            <button
                              onClick={() => handleDelete(svc.id)}
                              disabled={isDeleting}
                              title="Delete service"
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
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="h-3 bg-slate-800 rounded animate-pulse w-1/2" />
                    <div className="h-3 bg-slate-800 rounded animate-pulse w-3/4" />
                  </div>
                ))
              : services.map((svc) => {
                  const isToggling = togglingId === svc.id;
                  const isDeleting = deletingId === svc.id;
                  return (
                    <div key={svc.id} className={`p-4 transition-colors ${isDeleting ? "opacity-40" : "hover:bg-slate-800/40"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-100">{svc.name}</span>
                        <div className="flex items-center gap-2">
                          {/* Mobile toggle */}
                          <button
                            onClick={() => handleToggleStatus(svc)}
                            disabled={isToggling}
                            className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold
                              px-2 py-1 rounded-lg border transition-all
                              ${svc.status === "UP"
                                ? "text-emerald-400 border-emerald-500/30"
                                : "text-rose-400 border-rose-500/30"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${svc.status === "UP" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                            {svc.status}
                          </button>
                          {/* Mobile delete */}
                          <button
                            onClick={() => handleDelete(svc.id)}
                            disabled={isDeleting}
                            className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${typeColors[svc.type] ?? "text-slate-400 bg-slate-500/10 border-slate-500/30"}`}>
                          {svc.type}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{svc.region}</span>
                        <ResponseBar ms={svc.responseTime} />
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