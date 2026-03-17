import api from "./axios";

export async function createAppointment(payload) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function getMyAppointments() {
  const { data } = await api.get("/appointments/my");
  return data;
}

export async function getAppointmentById(id) {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
}

