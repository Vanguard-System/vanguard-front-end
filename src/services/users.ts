import api from "./api";

export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function CreateUser(userData: { email: string; username: string; password: string }) {
  const { data } = await api.post("/users", userData)
  return data
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token"); // assumindo que o JWT está salvo no login
  const { data } = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}