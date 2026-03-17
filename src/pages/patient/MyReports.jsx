import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { getMyReports } from "../../api/reports";

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reports)) return data.reports;
  return [];
}

export default function MyReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getMyReports()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load reports.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const reports = useMemo(() => normalize(data), [data]);

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">My Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          All reports associated with your appointments.
        </p>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">Reports</div>
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
                <th className="px-6 py-3">Diagnosis</th>
                <th className="px-6 py-3">Tests</th>
                <th className="px-6 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!loading && reports.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={4}>
                    No reports yet.
                  </td>
                </tr>
              )}
              {reports.map((r, idx) => (
                <tr
                  key={r.id || r._id || `${r.appointmentId}-${idx}`}
                  className="even:bg-gray-50"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {r.appointmentDate || r.appointmentId || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {r.diagnosis || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {r.testRecommended || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {r.remarks || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

