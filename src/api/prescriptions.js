import api from "./axios";

export async function getMyPrescriptions() {
  const { data } = await api.get("/prescriptions/my");
  return data;
}

export async function createPrescription(appointmentId, payload) {
  const { data } = await api.post(`/prescriptions/${appointmentId}`, payload);
  return data;
}

