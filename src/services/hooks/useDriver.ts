import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createDriver, deleteDriver, getDriver, updateDriver } from "../driver";

export function useDriver() {
  return useQuery({
    queryKey: ["driver"],
    queryFn: getDriver,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; cpf: string; paymentType: string }) => createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string; cpf?: string; paymentType?: string } }) =>
      updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
    },
  });
}
