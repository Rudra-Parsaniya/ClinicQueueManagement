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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Today's Patient Queue</h1>
        <p className="text-sm text-slate-500">
          Monitor your active queue and manage patient prescriptions and health reports.
        </p>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-emerald-500 rounded-full" />
            <span className="text-sm font-bold text-slate-900 leading-none">Active Queue</span>
          </div>
          {loading && <LoadingSpinner label="Refreshing queue..." />}
        </div>

        {error && (
          <div className="m-6">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-4">Token #</th>
                <th className="px-6 py-4">Patient Information</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-400" colSpan={4}>
                    No patient entries in the queue for today.
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
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shadow-xs">
                        {token}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{patientName}</div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-5">
                      {appointmentId ? (
                        <div className="flex items-center gap-2">
                          <Link
                            className="cms-btn-secondary !py-1.5 !px-3 text-[11px] !rounded-lg"
                            to={`/doctor/appointments/${appointmentId}/prescription`}
                          >
                            Prescription
                          </Link>
                          <Link
                            className="cms-btn-secondary !py-1.5 !px-3 text-[11px] !rounded-lg"
                            to={`/doctor/appointments/${appointmentId}/report`}
                          >
                            Lab Report
                          </Link>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Available upon arrival</span>
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

