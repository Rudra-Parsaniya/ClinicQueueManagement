import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { createPrescription } from "../../api/prescriptions";

function emptyMedicine() {
  return { name: "", dosage: "", duration: "" };
}

export default function AddPrescription() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [medicines, setMedicines] = useState([emptyMedicine()]);
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const payload = useMemo(
    () => ({
      medicines: medicines.map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        duration: m.duration.trim(),
      })),
      notes: notes.trim(),
    }),
    [medicines, notes],
  );

  const validate = () => {
    const next = {};
    const medErrors = medicines.map((m) => ({
      name: !m.name.trim() ? "Required" : "",
      dosage: !m.dosage.trim() ? "Required" : "",
      duration: !m.duration.trim() ? "Required" : "",
    }));

    if (medErrors.some((m) => m.name || m.dosage || m.duration)) {
      next.medicines = medErrors;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const updateMedicine = (idx, patch) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)),
    );
  };

  const addMedicine = () => setMedicines((prev) => [...prev, emptyMedicine()]);

  const removeMedicine = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createPrescription(appointmentId, payload);
      navigate("/doctor/queue", { replace: true });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to add prescription.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const medicineErrors = Array.isArray(errors.medicines) ? errors.medicines : [];

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Add Prescription
            </h1>
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
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Medicines</div>
          <button
            type="button"
            className="cms-btn-secondary text-xs"
            onClick={addMedicine}
            disabled={submitting}
          >
            Add Medicine
          </button>
        </div>

        <div className="space-y-3">
          {medicines.map((m, idx) => {
            const e = medicineErrors[idx] || {};
            return (
              <div key={idx} className="rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="cms-label">Name *</label>
                    <input
                      className="cms-input"
                      value={m.name}
                      onChange={(ev) =>
                        updateMedicine(idx, { name: ev.target.value })
                      }
                      placeholder="Medicine name"
                    />
                    {e.name && <p className="text-xs text-red-600">{e.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="cms-label">Dosage *</label>
                    <input
                      className="cms-input"
                      value={m.dosage}
                      onChange={(ev) =>
                        updateMedicine(idx, { dosage: ev.target.value })
                      }
                      placeholder="e.g., 1 tablet twice daily"
                    />
                    {e.dosage && (
                      <p className="text-xs text-red-600">{e.dosage}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="cms-label">Duration *</label>
                    <input
                      className="cms-input"
                      value={m.duration}
                      onChange={(ev) =>
                        updateMedicine(idx, { duration: ev.target.value })
                      }
                      placeholder="e.g., 5 days"
                    />
                    {e.duration && (
                      <p className="text-xs text-red-600">{e.duration}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-600 hover:text-gray-800 disabled:opacity-60"
                    onClick={() => removeMedicine(idx)}
                    disabled={submitting || medicines.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-1">
          <label className="cms-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="cms-input min-h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
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
            {submitting ? (
              <LoadingSpinner label="Saving..." />
            ) : (
              "Save Prescription"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

