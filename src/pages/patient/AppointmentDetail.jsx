import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { getAppointmentById } from "../../api/appointments";

function Section({ title, children }) {
  return (
    <div className="cms-card p-6">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function KeyValue({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-gray-900">
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function AppointmentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getAppointmentById(id)
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.message || "Failed to load appointment details.",
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const appt = data?.appointment || data;
  const queueEntry = appt?.queueEntry || data?.queueEntry;
  const prescription = appt?.prescription || data?.prescription;
  const report = appt?.report || data?.report;

  const status = appt?.status || queueEntry?.status || "queued";
  const token =
    appt?.tokenNumber ?? appt?.token ?? queueEntry?.tokenNumber ?? "—";

  return (
    <div className="space-y-4">
      <div className="cms-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Appointment Detail
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Token, status, prescription and report.
            </p>
          </div>
          <Link to="/patient/appointments" className="cms-btn-secondary">
            Back
          </Link>
        </div>
      </div>

      {loading && (
        <div className="cms-card p-6">
          <LoadingSpinner label="Loading appointment..." />
        </div>
      )}

      {error && (
        <div className="cms-card p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && appt && (
        <>
          <Section title="Appointment">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <KeyValue label="Date" value={appt.appointmentDate || appt.date} />
              <KeyValue label="Slot" value={appt.timeSlot || appt.slot} />
              <KeyValue label="Token" value={token} />
              <div>
                <div className="text-xs font-medium text-gray-500">Status</div>
                <div className="mt-1">
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Queue Entry">
            {queueEntry ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KeyValue
                  label="Token Number"
                  value={queueEntry.tokenNumber ?? "—"}
                />
                <KeyValue label="Queue Status" value={queueEntry.status ?? "—"} />
                <KeyValue label="Queue ID" value={queueEntry.id || queueEntry._id} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No queue entry data.</p>
            )}
          </Section>

          <Section title="Prescription">
            {prescription ? (
              <div className="space-y-3">
                {Array.isArray(prescription.medicines) &&
                  prescription.medicines.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                            <th className="px-4 py-2">Medicine</th>
                            <th className="px-4 py-2">Dosage</th>
                            <th className="px-4 py-2">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {prescription.medicines.map((m, idx) => (
                            <tr key={`${m.name}-${idx}`} className="even:bg-gray-50">
                              <td className="px-4 py-2 font-medium text-gray-900">
                                {m.name || "—"}
                              </td>
                              <td className="px-4 py-2 text-gray-700">
                                {m.dosage || "—"}
                              </td>
                              <td className="px-4 py-2 text-gray-700">
                                {m.duration || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                <div>
                  <div className="text-xs font-medium text-gray-500">Notes</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {prescription.notes || "—"}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No prescription yet.</p>
            )}
          </Section>

          <Section title="Report">
            {report ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KeyValue label="Diagnosis" value={report.diagnosis} />
                <KeyValue label="Tests" value={report.testRecommended} />
                <KeyValue label="Remarks" value={report.remarks} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No report yet.</p>
            )}
          </Section>
        </>
      )}

      {!loading && !error && !appt && (
        <div className="cms-card p-6">
          <p className="text-sm text-gray-500">No appointment found.</p>
        </div>
      )}
    </div>
  );
}

