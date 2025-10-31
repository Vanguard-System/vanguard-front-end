// services/hooks/useDriver.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createDriver, deleteDriver, getDriver, getDriverRemuneration, updateDriver } from "../driver";

// Hook para buscar todos os motoristas
export function useDriver() {
  return useQuery({
    queryKey: ["driver"],
    queryFn: getDriver,
  });
}

export const useDriverRemuneration = (driverId: string, month: number, year: number) => {
  return useQuery({
    queryKey: ["driverRemuneration", driverId, month, year],
    queryFn: () => getDriverRemuneration(driverId, month, year),
    enabled: !!driverId && !!month && !!year,
  });
}

// Hook para criar motorista
export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; cpf: string; driverCost: number; dailyPriceDriver: number }) => createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}

// Hook para atualizar motorista
export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string; cpf?: string; driverCost?: number; dailyPriceDriver?: number } }) =>
      updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}

// Hook para deletar motorista
export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}
