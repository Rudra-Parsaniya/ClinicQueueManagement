import api from "./axios";

export async function getDoctorQueue() {
  const { data } = await api.get("/doctor/queue");
  return data;
}

