import api from "./api";

export async function getCar() {
  const { data } = await api.get("/car");
  return data;
}

export async function createCar(carData: { model: string; plate: string; consumption: number; fixed_cost: number }) {
  const { data } = await api.post("/car", carData);
  return data;
}

export async function updateCar(id: string, carData: { model?: string; plate?: string; consumption: number; fixed_cost: number }) {
  const { data } = await api.put(`/car/${id}`, carData);
  return data;
}

export async function deleteCar(id: string) {
  const { data } = await api.delete(`/car/${id}`);
  return data;
}
