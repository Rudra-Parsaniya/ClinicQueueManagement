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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
      
      <div className="cms-card w-full max-w-md p-8 relative z-10 backdrop-blur-sm bg-white/90">
        <div className="text-center mb-10">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-emerald-500/20 mb-4">
            CMS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to the Clinic Queue Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="cms-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="cms-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="cms-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="cms-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>
            )}
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 animate-in fade-in duration-300">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="cms-btn w-full py-3"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner label="Authenticating..." /> : "Sign in to Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Secure Access for Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}

