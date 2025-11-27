import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../auth";

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password, recaptchaToken }: { email: string; password: string, recaptchaToken: string }) =>
      login(email, password, recaptchaToken),
  });
}

export function useLogout() {
  return () => logout();
}
