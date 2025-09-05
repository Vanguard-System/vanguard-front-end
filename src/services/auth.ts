import api from "./api";

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/signin', { email, password });

  return data;
}

export async function logout() {
  await api.post('/auth/logout'); 
}

export async function getMe() {
  const { data } = await api.get("/auth/me", {
    withCredentials: true, 
  });
  return data; 
}