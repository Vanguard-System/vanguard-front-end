import { useMutation } from "@tanstack/react-query";
import { login, logout, verify2FA } from "../auth";

// Login com suporte a 2FA
export function useLogin() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      recaptchaToken,
    }: {
      email: string;
      password: string;
      recaptchaToken: string;
    }) => {
      const result = await login(email, password, recaptchaToken);

      // Se o backend retornar que 2FA é necessário
      if (result.twoFactorRequired) {
        return {
          twoFactorRequired: true,
          email: result.email,
        };
      }

      // Login normal (sem 2FA)
      return {
        twoFactorRequired: false,
        ...result,
      };
    },
  });
}

// Verificação do código 2FA
export function useVerify2FA() {
  return useMutation({
    mutationFn: async ({
      email,
      code,
    }: {
      email: string;
      code: string;
    }) => {
      const result = await verify2FA(email, code);

      return {
        success: true,
        ...result,
      };
    },
  });
}

// Logout permanece igual
export function useLogout() {
  return () => logout();
}
