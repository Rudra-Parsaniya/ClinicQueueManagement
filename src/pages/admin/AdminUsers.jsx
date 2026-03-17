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
    <div className="space-y-4">
      <div className="cms-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage clinic users (admin, doctor, receptionist, patient).
            </p>
          </div>
          <Link to="/admin/users/create" className="cms-btn">
            Create User
          </Link>
        </div>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">All users</div>
          {loading && <LoadingSpinner label="Loading users..." />}
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
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!loading && users.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={3}>
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((u, idx) => (
                <tr key={u.id || u._id || `${u.email}-${idx}`} className="even:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {u.name || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{u.email || "—"}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {String(u.role || "—").toUpperCase()}
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

