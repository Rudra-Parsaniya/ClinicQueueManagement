import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { createReport } from "../../api/reports";

export default function AddReport() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [diagnosis, setDiagnosis] = useState("");
  const [testRecommended, setTestRecommended] = useState("");
  const [remarks, setRemarks] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const payload = useMemo(
    () => ({
      diagnosis: diagnosis.trim(),
      testRecommended: testRecommended.trim(),
      remarks: remarks.trim(),
    }),
    [diagnosis, testRecommended, remarks],
  );

  const validate = () => {
    const next = {};
    if (!diagnosis.trim()) next.diagnosis = "Diagnosis is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createReport(appointmentId, payload);
      navigate("/doctor/queue", { replace: true });
    } catch (err) {
      const apiErr = err?.response?.data;
      if (apiErr?.error === "Duplicate value") {
        setSubmitError("A report already exists for this appointment.");
      } else {
        setSubmitError(apiErr?.message || "Failed to add report.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Add Report</h1>
            <p className="mt-1 text-sm text-gray-500">
              Appointment ID: <span className="font-medium">{appointmentId}</span>
            </p>
          </div>
          <Link to="/doctor/queue" className="cms-btn-secondary">
            Back to Queue
          </Link>
        </div>
      </div>

      <form onSubmit={onSubmit} className="cms-card p-6 space-y-4">
        <div className="space-y-1">
          <label className="cms-label" htmlFor="diagnosis">
            Diagnosis<span className="text-red-600"> *</span>
          </label>
          <input
            id="diagnosis"
            className="cms-input"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Diagnosis"
          />
          {errors.diagnosis && (
            <p className="text-xs text-red-600">{errors.diagnosis}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="cms-label" htmlFor="testRecommended">
            Test Recommended
          </label>
          <input
            id="testRecommended"
            className="cms-input"
            value={testRecommended}
            onChange={(e) => setTestRecommended(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-1">
          <label className="cms-label" htmlFor="remarks">
            Remarks
          </label>
          <textarea
            id="remarks"
            className="cms-input min-h-28"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional"
          />
        </div>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link to="/doctor/queue" className="cms-btn-secondary">
            Cancel
          </Link>
          <button className="cms-btn" type="submit" disabled={submitting}>
            {submitting ? <LoadingSpinner label="Saving..." /> : "Save Report"}
          </button>
        </div>
      </form>
    </div>
  );
}

