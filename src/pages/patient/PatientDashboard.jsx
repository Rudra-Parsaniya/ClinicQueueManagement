import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <h1 className="text-lg font-semibold text-gray-900">Patient Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Book appointments and track your queue status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="cms-card p-6">
          <div className="text-sm font-semibold text-gray-900">
            Book an appointment
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Choose a date and time slot to get a token for the queue.
          </p>
          <Link to="/patient/book" className="mt-4 inline-flex cms-btn">
            Book now
          </Link>
        </div>

        <div className="cms-card p-6">
          <div className="text-sm font-semibold text-gray-900">
            My appointments
          </div>
          <p className="mt-1 text-sm text-gray-500">
            View tokens, status, prescriptions, and reports.
          </p>
          <Link
            to="/patient/appointments"
            className="mt-4 inline-flex cms-btn-secondary"
          >
            View appointments
          </Link>
        </div>
      </div>
    </div>
  );
}

