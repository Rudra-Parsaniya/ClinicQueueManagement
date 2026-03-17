import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const baseLinkClasses =
  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors";

function linkClasses({ isActive }) {
  return isActive
    ? `${baseLinkClasses} bg-indigo-50 text-indigo-700`
    : `${baseLinkClasses} text-gray-700 hover:bg-gray-50`;
}

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const common = [];
  const links = [];

  if (role === "admin") {
    links.push(
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/users/create", label: "Create User" },
    );
  }

  if (role === "patient") {
    links.push(
      { to: "/patient", label: "Dashboard" },
      { to: "/patient/book", label: "Book Appointment" },
      { to: "/patient/appointments", label: "My Appointments" },
      { to: "/patient/prescriptions", label: "My Prescriptions" },
      { to: "/patient/reports", label: "My Reports" },
    );
  }

  if (role === "receptionist") {
    links.push(
      { to: "/receptionist", label: "Dashboard" },
      { to: "/receptionist/queue", label: "Queue" },
    );
  }

  if (role === "doctor") {
    links.push(
      { to: "/doctor", label: "Dashboard" },
      { to: "/doctor/queue", label: "Queue" },
    );
  }

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white px-3 py-4">
      <nav className="space-y-1">
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

