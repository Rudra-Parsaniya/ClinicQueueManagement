import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            CMS
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {user?.clinicName || "Clinic Management System"}
            </div>
            <div className="text-xs text-gray-500">
              {user?.clinicCode ? `Code: ${user.clinicCode}` : "Queue Management"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 uppercase">
                {user.role}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="cms-btn-secondary text-xs"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

