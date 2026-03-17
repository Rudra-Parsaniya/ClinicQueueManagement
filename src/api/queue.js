import api from "./axios";

export async function getQueueByDate(dateISO) {
  const { data } = await api.get("/queue", { params: { date: dateISO } });
  return data;
}

export async function updateQueueStatus(id, status) {
  const { data } = await api.patch(`/queue/${id}`, { status });
  return data;
}

