import api from "./api";

export async function login(email: string, password: string, recaptchaToken: string) {
  const { data } = await api.post('/auth/signin', {
    email,
    password,
    recaptchaToken,
  });

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