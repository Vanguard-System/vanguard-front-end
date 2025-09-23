import api from "./api";

export async function getDriver() {
  const { data } = await api.get("/driver");
  return data;
}

export async function createDriver(driverData: { name: string; email: string; cpf: string; paymentType: string }) {
  const { data } = await api.post("/driver", driverData);
  return data;
}

export async function updateDriver(
  id: string,
  driverData: { name?: string; email?: string; cpf?: string; paymentType?: string }
) {
  const { data } = await api.put(`/driver/${id}`, driverData);
  return data;
}

export async function deleteDriver(id: string) {
  const { data } = await api.delete(`/driver/${id}`);
  return data;
}
