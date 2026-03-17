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
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">Daily Queue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a date to view and manage the queue.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <label className="cms-label" htmlFor="queueDate">
              Date
            </label>
            <input
              id="queueDate"
              type="date"
              className="cms-input sm:w-56"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            className="cms-btn sm:w-auto"
            type="button"
            onClick={() => load(date)}
            disabled={loading}
          >
            {loading ? <LoadingSpinner label="Loading..." /> : "Load Queue"}
          </button>
        </div>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">Queue</div>
          {loading && <LoadingSpinner label="Loading queue..." />}
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
              {!loading && entries.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={4}>
                    No queue entries for this date.
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
                  <tr key={id || `${token}-${idx}`} className="even:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {token}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{patientName}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-3">
                      {options.length === 0 ? (
                        <span className="text-xs text-gray-400">No actions</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            className="cms-input w-40"
                            defaultValue=""
                            disabled={updatingId === id}
                            onChange={(ev) => {
                              const val = ev.target.value;
                              if (!val) return;
                              onChangeStatus(id, val);
                              ev.target.value = "";
                            }}
                          >
                            <option value="">Update…</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt === "in-progress"
                                  ? "In Progress"
                                  : opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                          {updatingId === id && (
                            <LoadingSpinner label="Updating..." />
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

