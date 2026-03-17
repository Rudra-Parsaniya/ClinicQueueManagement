import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { createAppointment } from "../../api/appointments";

// Backend expects timeSlot like "10:00-10:15"
const SLOT_OPTIONS = [
  "09:00-09:15",
  "09:15-09:30",
  "09:30-09:45",
  "09:45-10:00",
  "10:00-10:15",
  "10:15-10:30",
  "10:30-10:45",
  "10:45-11:00",
  "11:00-11:15",
  "11:15-11:30",
  "11:30-11:45",
  "11:45-12:00",
  "16:00-16:15",
  "16:15-16:30",
  "16:30-16:45",
  "16:45-17:00",
];

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookAppointment() {
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState(todayISO());
  const [timeSlot, setTimeSlot] = useState(SLOT_OPTIONS[0]);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const payload = useMemo(
    () => ({
      appointmentDate,
      timeSlot,
    }),
    [appointmentDate, timeSlot],
  );

  const validate = () => {
    const next = {};
    if (!appointmentDate) next.appointmentDate = "Appointment date is required.";
    if (!timeSlot) next.timeSlot = "Time slot is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await createAppointment(payload);
      const appointmentId = res?.id || res?._id || res?.appointment?.id || res?.appointment?._id;
      if (appointmentId) {
        navigate(`/patient/appointments/${appointmentId}`, { replace: true });
      } else {
        navigate("/patient/appointments", { replace: true });
      }
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to book appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Book Appointment
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Select your preferred date and time slot.
        </p>
      </div>

      <form onSubmit={onSubmit} className="cms-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="cms-label" htmlFor="appointmentDate">
              Appointment Date<span className="text-red-600"> *</span>
            </label>
            <input
              id="appointmentDate"
              type="date"
              className="cms-input"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            {errors.appointmentDate && (
              <p className="text-xs text-red-600">{errors.appointmentDate}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="cms-label" htmlFor="timeSlot">
              Time Slot<span className="text-red-600"> *</span>
            </label>
            <select
              id="timeSlot"
              className="cms-input"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">Select a time slot</option>
              {SLOT_OPTIONS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <p className="text-xs text-red-600">{errors.timeSlot}</p>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="cms-btn-secondary"
            onClick={() => navigate("/patient")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button className="cms-btn" type="submit" disabled={submitting}>
            {submitting ? <LoadingSpinner label="Booking..." /> : "Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

