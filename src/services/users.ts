import api from "./api";

export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function CreateUser(userData: {
  email: string;
  username: string;
  password: string;
  recaptchaToken: string;
}) {
  const { data } = await api.post("/users", userData);
  return data;
}


export async function getCurrentUser() {
  const token = localStorage.getItem("token"); 
  const { data } = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function requestPasswordReset(email: string) {
  const { data } = await api.post("/users/forgot-password", { email });
  return data;
}

export async function resetPassword({
  email,
  code,
  newPassword,
}: {
  email: string;
  code: string;
  newPassword: string;
}) {
  const { data } = await api.post("/users/reset-password", {
    email,
    code,
    newPassword,
  });
  return data;
}

export async function updateUser(
  id: string,
  userData: { username?: string; email?: string; }
) {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
}