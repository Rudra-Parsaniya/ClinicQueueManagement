import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const baseLinkClasses =
  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200";

function linkClasses({ isActive }) {
  return isActive
    ? `${baseLinkClasses} bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-100`
    : `${baseLinkClasses} text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent`;
}

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const common = [];
  const links = [];

  if (role === "admin") {
    links.push(
      { to: "/admin", label: "Overview" },
      { to: "/admin/users", label: "User Management" },
      { to: "/admin/users/create", label: "Add New User" },
    );
  }

  if (role === "patient") {
    links.push(
      { to: "/patient", label: "Overview" },
      { to: "/patient/book", label: "Book Visit" },
      { to: "/patient/appointments", label: "My Visits" },
      { to: "/patient/prescriptions", label: "Prescriptions" },
      { to: "/patient/reports", label: "Health Reports" },
    );
  }

  if (role === "receptionist") {
    links.push(
      { to: "/receptionist", label: "Dashboard" },
      { to: "/receptionist/queue", label: "Active Queue" },
    );
  }

  if (role === "doctor") {
    links.push(
      { to: "/doctor", label: "Overview" },
      { to: "/doctor/queue", label: "Patient Queue" },
    );
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <nav className="sticky top-[89px] space-y-2 py-4">
        <div className="px-4 mb-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Menu
          </h2>
        </div>
        {common.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClasses}>
            {item.label}
          </NavLink>
        ))}
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClasses}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

