import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getDoctorQueue } from "../../api/doctor";

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.queue)) return data.queue;
  if (Array.isArray(data?.entries)) return data.entries;
  return [];
}

export default function DoctorQueue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getDoctorQueue()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load doctor queue.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => normalize(data), [data]);

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">Today’s Queue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add prescriptions and reports for appointments.
        </p>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">Queue</div>
          {loading && <LoadingSpinner label="Loading..." />}
        </div>

        {error && (
          <div className="px-6 pb-4">
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border-t border-gray-200 text-left text-sm">
            <thead className="bg-white">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                <th className="px-6 py-3">Token</th>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={4}>
                    No queue entries today.
                  </td>
                </tr>
              )}

              {rows.map((r, idx) => {
                const appointmentId = r.appointmentId || r.appointment?.id || r.appointment?._id;
                const token = r.tokenNumber ?? r.token ?? "—";
                const patientName =
                  r.patientName || r.patient?.name || r.appointment?.patientName || "—";
                const status = r.status || "queued";

                return (
                  <tr
                    key={r.id || r._id || `${token}-${idx}`}
                    className="even:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {token}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{patientName}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-3">
                      {appointmentId ? (
                        <div className="flex items-center gap-2">
                          <Link
                            className="cms-btn-secondary text-xs"
                            to={`/doctor/appointments/${appointmentId}/prescription`}
                          >
                            Add Prescription
                          </Link>
                          <Link
                            className="cms-btn-secondary text-xs"
                            to={`/doctor/appointments/${appointmentId}/report`}
                          >
                            Add Report
                          </Link>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

