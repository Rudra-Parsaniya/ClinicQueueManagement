import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { getMyPrescriptions } from "../../api/prescriptions";

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.prescriptions)) return data.prescriptions;
  return [];
}

export default function MyPrescriptions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getMyPrescriptions()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.message || "Failed to load prescriptions.",
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const prescriptions = useMemo(() => normalize(data), [data]);

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">
          My Prescriptions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          All prescriptions associated with your appointments.
        </p>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">
            Prescriptions
          </div>
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
                <th className="px-6 py-3">Appointment</th>
                <th className="px-6 py-3">Medicines</th>
                <th className="px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!loading && prescriptions.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={3}>
                    No prescriptions yet.
                  </td>
                </tr>
              )}
              {prescriptions.map((p, idx) => {
                const meds = Array.isArray(p.medicines) ? p.medicines : [];
                const medsLabel =
                  meds.length > 0
                    ? meds.map((m) => m.name).filter(Boolean).join(", ")
                    : "—";
                return (
                  <tr
                    key={p.id || p._id || `${p.appointmentId}-${idx}`}
                    className="even:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {p.appointmentDate || p.appointmentId || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{medsLabel}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {p.notes || "—"}
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

