import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { getClinic } from "../../api/admin";

function StatCard({ label, value }) {
  return (
    <div className="cms-card p-4">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-gray-900">{value}</div>
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
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Clinic overview and user management.
        </p>
      </div>

      <div className="cms-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-gray-900">Clinic</h2>
          {loading && <LoadingSpinner label="Loading clinic..." />}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && clinic && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard label="Clinic Name" value={clinic.name || "—"} />
              <StatCard label="Clinic Code" value={clinic.code || "—"} />
              <StatCard label="Clinic ID" value={clinic.id || "—"} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label="Users"
                value={clinic.userCount ?? "—"}
              />
              <StatCard
                label="Appointments"
                value={clinic.appointmentCount ?? "—"}
              />
              <StatCard
                label="Queue Entries"
                value={clinic.queueCount ?? "—"}
              />
            </div>
          </div>
        )}

        {!loading && !error && !clinic && (
          <p className="mt-3 text-sm text-gray-500">No clinic data found.</p>
        )}
      </div>
    </div>
  );
}

