import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getQueueByDate, updateQueueStatus } from "../../api/queue";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.queue)) return data.queue;
  if (Array.isArray(data?.entries)) return data.entries;
  return [];
}

const NEXT_STATUS_OPTIONS = {
  waiting: ["in-progress", "skipped"],
  in_progress: ["done"],
  done: [],
  skipped: [],
};

function statusKey(value) {
  return String(value || "").toLowerCase().replace("-", "_");
}

export default function QueuePage() {
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async (dateISO) => {
    setLoading(true);
    setError("");
    try {
      const res = await getQueueByDate(dateISO);
      setData(res);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = useMemo(() => normalize(data), [data]);

  const onChangeStatus = async (entryId, nextStatus) => {
    setUpdatingId(entryId);
    try {
      await updateQueueStatus(entryId, nextStatus);
      await load(date);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinic Traffic Manager</h1>
        <p className="text-sm text-slate-500">
          Monitor and direct the flow of patients throughout the clinic for any selected date.
        </p>
      </div>

      <div className="cms-card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end justify-between">
          <div className="flex-1 max-w-sm">
            <label className="cms-label" htmlFor="queueDate">
              Operational Date
            </label>
            <div className="relative">
               <input
                id="queueDate"
                type="date"
                className="cms-input pr-10"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <button
            className="cms-btn px-8"
            type="button"
            onClick={() => load(date)}
            disabled={loading}
          >
            {loading ? <LoadingSpinner label="Synchronizing..." /> : "Refresh View"}
          </button>
        </div>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
           <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-emerald-500 rounded-full" />
            <span className="text-sm font-bold text-slate-900 leading-none">Management Queue</span>
          </div>
          {loading && <LoadingSpinner label="Updating..." />}
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
                <th className="px-6 py-4">Position #</th>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Active Status</th>
                <th className="px-6 py-4">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && entries.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-400 font-medium italic" colSpan={4}>
                    No clinical activity scheduled for this specific date.
                  </td>
                </tr>
              )}

              {entries.map((e, idx) => {
                const id = e.id || e._id;
                const status = e.status || "waiting";
                const token = e.tokenNumber ?? e.token ?? "—";
                const patientName =
                  e.patientName ||
                  e.patient?.name ||
                  e.appointment?.patientName ||
                  "—";

                const options = NEXT_STATUS_OPTIONS[statusKey(status)] || [];

                return (
                  <tr key={id || `${token}-${idx}`} className="group hover:bg-slate-50/80 transition-colors">
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
                      {options.length === 0 ? (
                        <div className="flex items-center gap-2 text-slate-400">
                           <span className="text-xs font-medium italic">Cycle Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <select
                              className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg block w-36 px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all pr-8"
                              defaultValue=""
                              disabled={updatingId === id}
                              onChange={(ev) => {
                                const val = ev.target.value;
                                if (!val) return;
                                onChangeStatus(id, val);
                                ev.target.value = "";
                              }}
                            >
                              <option value="">Status Shift…</option>
                              {options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt === "in-progress"
                                    ? "Start Session"
                                    : opt === "done" 
                                    ? "Mark Completed" 
                                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                          </div>
                          {updatingId === id && (
                             <LoadingSpinner />
                          )}
                        </div>
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

