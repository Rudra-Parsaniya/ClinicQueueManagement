import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Services</h1>
        <p className="text-sm text-slate-500">
          Access healthcare services, book consultations, and view your clinical history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="cms-card p-8 group hover:border-emerald-100 transition-all">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Book Appointment</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Schedule a new consultation with our healthcare professionals and receive an instant queue token.
          </p>
          <Link to="/patient/book" className="cms-btn w-full">
            Begin Booking Process
          </Link>
        </div>

        <div className="cms-card p-8 group hover:border-blue-100 transition-all">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">My Appointments</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Review your upcoming visits, check real-time queue status, and access digital prescriptions or reports.
          </p>
          <Link to="/patient/appointments" className="cms-btn-secondary w-full">
            Review Appointment History
          </Link>
        </div>
      </div>
    </div>
  );
}

