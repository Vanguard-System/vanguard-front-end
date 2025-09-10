import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCar, deleteCar, getCar, updateCar } from "../car";

export function useCar() {
  return useQuery({
    queryKey: ["car"], 
    queryFn: getCar,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { model: string; plate: string }) => createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car"] }); 
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { model?: string; plate?: string } }) =>
      updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
  });
}
