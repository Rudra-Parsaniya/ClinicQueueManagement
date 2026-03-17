import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getMyAppointments } from "../../api/appointments";

function normalizeAppointments(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.appointments)) return data.appointments;
  return [];
}

export default function MyAppointments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getMyAppointments()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.message || "Failed to load appointments.",
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const appointments = useMemo(() => normalizeAppointments(data), [data]);

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              My Appointments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your appointment tokens and current status.
            </p>
          </div>
          <Link to="/patient/book" className="cms-btn">
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">Appointments</div>
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
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Slot</th>
                <th className="px-6 py-3">Token</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!loading && appointments.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={5}>
                    No appointments yet.
                  </td>
                </tr>
              )}
              {appointments.map((a, idx) => {
                const id = a.id || a._id;
                const token =
                  a.tokenNumber ??
                  a.token ??
                  a.queueEntry?.tokenNumber ??
                  "—";
                const status = a.status || a.queueEntry?.status || "queued";
                return (
                  <tr
                    key={id || `${a.appointmentDate}-${idx}`}
                    className="even:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-gray-900">
                      {a.appointmentDate || a.date || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {a.timeSlot || a.slot || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{token}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      {id ? (
                        <Link
                          to={`/patient/appointments/${id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          View
                        </Link>
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

