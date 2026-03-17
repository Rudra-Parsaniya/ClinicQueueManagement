import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { getClinic } from "../../api/admin";

function StatCard({ label, value, icon }) {
  return (
    <div className="cms-card p-5 hover:border-emerald-100 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {icon && <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors uppercase font-bold text-[10px]">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getClinic()
      .then((data) => {
        if (mounted) setClinic(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.message || "Failed to load clinic information.",
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <p className="text-sm text-slate-500">
          Manage clinic settings, user roles, and monitor system-wide activity.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Clinic Information</h2>
          {loading && <LoadingSpinner label="Refreshing..." />}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && clinic && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <StatCard label="Clinic Name" value={clinic.name || "—"} icon="Name" />
              <StatCard label="Public Code" value={clinic.code || "—"} icon="Code" />
              <StatCard label="System ID" value={clinic.id || "—"} icon="ID" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <StatCard
                label="Registered Users"
                value={clinic.userCount ?? "0"}
                icon="Users"
              />
              <StatCard
                label="Total Appointments"
                value={clinic.appointmentCount ?? "0"}
                icon="Calendar"
              />
              <StatCard
                label="Active Queue"
                value={clinic.queueCount ?? "0"}
                icon="Queue"
              />
            </div>
          </div>
        )}

        {!loading && !error && !clinic && (
          <div className="cms-card p-12 text-center">
             <p className="text-sm font-medium text-slate-500 italic">No clinic data available within the current scope.</p>
          </div>
        )}
      </div>
    </div>
  );
}

