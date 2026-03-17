import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { ForbiddenPage, NotFoundPage } from "./pages/NotFoundPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCreateUser from "./pages/admin/AdminCreateUser.jsx";
import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import MyAppointments from "./pages/patient/MyAppointments.jsx";
import AppointmentDetail from "./pages/patient/AppointmentDetail.jsx";
import MyPrescriptions from "./pages/patient/MyPrescriptions.jsx";
import MyReports from "./pages/patient/MyReports.jsx";
import QueuePage from "./pages/receptionist/QueuePage.jsx";
import DoctorQueue from "./pages/doctor/DoctorQueue.jsx";
import AddPrescription from "./pages/doctor/AddPrescription.jsx";
import AddReport from "./pages/doctor/AddReport.jsx";

function ReceptionistDashboard() {
  return (
    <div className="cms-card p-6">
      <h1 className="text-lg font-semibold text-gray-900">
        Receptionist Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage today&apos;s queue and patient flow.
      </p>
    </div>
  );
}

function DoctorDashboard() {
  return (
    <div className="cms-card p-6">
      <h1 className="text-lg font-semibold text-gray-900">Doctor Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        See your queue and update prescriptions and reports.
      </p>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 space-y-4">
          <Routes>
            <Route
              path="/admin"
              element={<ProtectedRoute allowedRoles={["admin"]} />}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/create" element={<AdminCreateUser />} />
            </Route>

            <Route
              path="/patient"
              element={<ProtectedRoute allowedRoles={["patient"]} />}
            >
              <Route index element={<PatientDashboard />} />
              <Route path="book" element={<BookAppointment />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="appointments/:id" element={<AppointmentDetail />} />
              <Route path="prescriptions" element={<MyPrescriptions />} />
              <Route path="reports" element={<MyReports />} />
            </Route>

            <Route
              path="/receptionist"
              element={<ProtectedRoute allowedRoles={["receptionist"]} />}
            >
              <Route index element={<ReceptionistDashboard />} />
              <Route path="queue" element={<QueuePage />} />
            </Route>

            <Route
              path="/doctor"
              element={<ProtectedRoute allowedRoles={["doctor"]} />}
            >
              <Route index element={<DoctorDashboard />} />
              <Route path="queue" element={<DoctorQueue />} />
              <Route
                path="appointments/:appointmentId/prescription"
                element={<AddPrescription />}
              />
              <Route
                path="appointments/:appointmentId/report"
                element={<AddReport />}
              />
            </Route>

            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
