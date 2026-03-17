import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { createUser } from "../../api/admin";

const ROLE_OPTIONS = [
  { value: "doctor", label: "Doctor" },
  { value: "receptionist", label: "Receptionist" },
  { value: "patient", label: "Patient" },
];

export default function AdminCreateUser() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    if (!role) next.role = "Role is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const payload = useMemo(
    () => ({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      phone: phone.trim() || undefined,
    }),
    [name, email, password, role, phone],
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createUser(payload);
      navigate("/admin/users", { replace: true });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to create user.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Create User
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new doctor, receptionist, or patient.
            </p>
          </div>
          <Link to="/admin/users" className="cms-btn-secondary">
            Back to Users
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} className="cms-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-1">
            <label className="cms-label" htmlFor="name">
              Name<span className="text-red-600"> *</span>
            </label>
            <input
              id="name"
              className="cms-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="cms-label" htmlFor="email">
              Email<span className="text-red-600"> *</span>
            </label>
            <input
              id="email"
              type="email"
              className="cms-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="cms-label" htmlFor="password">
              Password<span className="text-red-600"> *</span>
            </label>
            <input
              id="password"
              type="password"
              className="cms-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="cms-label" htmlFor="role">
              Role<span className="text-red-600"> *</span>
            </label>
            <select
              id="role"
              className="cms-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs text-red-600">{errors.role}</p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="cms-label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className="cms-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link to="/admin/users" className="cms-btn-secondary">
            Cancel
          </Link>
          <button className="cms-btn" type="submit" disabled={submitting}>
            {submitting ? (
              <LoadingSpinner label="Creating..." />
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

