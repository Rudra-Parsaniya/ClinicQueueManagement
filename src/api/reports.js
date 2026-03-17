import api from "./axios";

export async function getMyReports() {
  const { data } = await api.get("/reports/my");
  return data;
}

export async function createReport(appointmentId, payload) {
  const { data } = await api.post(`/reports/${appointmentId}`, payload);
  return data;
}

