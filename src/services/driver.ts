// services/driver.ts
import api from "./api";

// Buscar todos os motoristas
export async function getDriver() {
  const { data } = await api.get("/driver");
  return data;
}

// Buscar remuneração de um motorista específico
export async function getDriverRemuneration(driverId: string, month: number, year: number) {
  const { data } = await api.get(`/driver/${driverId}/remuneration`, {
    params: { month, year },
  });
  return data;
}

// Criar motorista
export async function createDriver(driverData: { name: string; email: string; cpf: string; driverCost: number; dailyPriceDriver: number }) {
  const { data } = await api.post("/driver", driverData);
  return data;
}

// Atualizar motorista
export async function updateDriver(
  id: string,
  driverData: { name?: string; email?: string; cpf?: string; driverCost?: number; dailyPriceDriver?: number }
) {
  const { data } = await api.put(`/driver/${id}`, driverData);
  return data;
}

// Deletar motorista
export async function deleteDriver(id: string) {
  const { data } = await api.delete(`/driver/${id}`);
  return data;
}
