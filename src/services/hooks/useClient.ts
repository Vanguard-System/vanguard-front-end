import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, deleteClient, getClient, updateClient } from "../client";

export function useClient() {
  return useQuery({
    queryKey: ["client"],
    queryFn: getClient,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; email: string; telephone: string }) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client"] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { email?: string; name?: string; telephone?: string } }) =>
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client"] }); 
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client"] }); 
    },
  });
}