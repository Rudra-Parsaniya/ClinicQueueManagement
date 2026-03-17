import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-emerald-500/20">
            CMS
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              {user?.clinicName || "Clinic Management System"}
            </h1>
            <span className="text-xs font-medium text-slate-500">
              {user?.clinicCode ? `System Access: ${user.clinicCode}` : "Queue Management"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {user && (
            <div className="flex items-center gap-3 pr-2 border-r border-slate-100">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                  {user.role}
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 font-bold overflow-hidden">
                 {user.name?.charAt(0) || "U"}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="cms-btn-secondary !py-2 !px-4 text-xs !rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

