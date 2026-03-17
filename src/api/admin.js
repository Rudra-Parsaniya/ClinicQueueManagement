import api from "./axios";

export async function getClinic() {
  const { data } = await api.get("/admin/clinic");
  return data;
}

export async function getUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post("/admin/users", payload);
  return data;
}

