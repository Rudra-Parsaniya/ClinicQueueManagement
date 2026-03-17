import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { getUsers } from "../../api/admin";

function normalizeUsers(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  return [];
}

export default function AdminUsers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getUsers()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load users.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const users = useMemo(() => normalizeUsers(data), [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Directory</h1>
          <p className="text-sm text-slate-500">
            View and manage all registered clinic staff and patients.
          </p>
        </div>
        <Link to="/admin/users/create" className="cms-btn">
          Create New User
        </Link>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-emerald-500 rounded-full" />
            <span className="text-sm font-bold text-slate-900 leading-none">System Users</span>
          </div>
          {loading && <LoadingSpinner label="Refreshing logs..." />}
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
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Security Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && users.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-400" colSpan={2}>
                    No registered users found in the directory.
                  </td>
                </tr>
              )}
              {users.map((u, idx) => (
                <tr key={u.id || u._id || `${u.email}-${idx}`} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 font-bold group-hover:bg-white transition-colors">
                        {u.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{u.name || "Unknown User"}</div>
                        <div className="text-xs text-slate-500 font-medium">{u.email || "No email provided"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                      u.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-100" :
                      u.role === "doctor" ? "bg-blue-50 text-blue-700 border-blue-100" :
                      u.role === "receptionist" ? "bg-amber-50 text-amber-700 border-amber-100" :
                      "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {String(u.role || "patient")}
                    </span>
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

