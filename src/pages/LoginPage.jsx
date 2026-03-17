import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function getDashboardPath(role) {
  switch (role) {
    case "admin":
      return "/admin";
    case "patient":
      return "/patient";
    case "receptionist":
      return "/receptionist";
    case "doctor":
      return "/doctor";
    default:
      return "/";
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("enrollment@darshan.ac.in");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!email) nextErrors.email = "Email is required.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      const path = getDashboardPath(user.role);
      navigate(path, { replace: true });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="cms-card w-full max-w-md px-6 py-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Clinic Queue Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to access your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="cms-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="cms-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="cms-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="cms-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="cms-btn w-full justify-center"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner label="Signing in..." /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

