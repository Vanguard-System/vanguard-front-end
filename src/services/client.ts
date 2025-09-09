import api from "./api";

export async function getClient() {
  const { data } = await api.get("/client");
  return data;
}

export async function createClient(userData: { email: string; name: string; telephone: string }) {
  const { data } = await api.post("/client", userData);
  return data;
}

export async function updateClient(id: string, userData: { email?: string; name?: string; telephone?: string }) {
  const { data } = await api.put(`/client/${id}`, userData);
  return data;
}

export async function deleteClient(id: string) {
  const { data } = await api.delete(`/client/${id}`);
  return data;
}
