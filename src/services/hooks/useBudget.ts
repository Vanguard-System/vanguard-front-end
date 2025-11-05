import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getBudget,
  getTripFromBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  updateBudgetStatus,
} from "../budget"

// Hook para pegar todos os budgets
export function useBudget() {
  return useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
  })
}

// Hook para pegar viagens relacionadas a budgets
export function useBudgetTrips() {
  return useQuery({
    queryKey: ["budgetTrips"],
    queryFn: getTripFromBudget,
  })
}

// Hook para criar um budget
export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      origem: string
      destino: string
      data_hora_viagem: string
      data_hora_viagem_retorno: string
      pedagio: number
      lucroDesejado: number
      impostoPercent: number
      numMotoristas: number
      custoExtra: number
      driver_id: string[]
      car_id: string
      cliente_id: string
    }) => createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] })
    },
  })
}

// Hook para atualizar um budget
export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<{
        origem: string
        destino: string
        data_hora_viagem: string
        data_hora_viagem_retorno: string
        pedagio: number
        lucroDesejado: number
        impostoPercent: number
        numMotoristas: number
        custoExtra: number
        driver_ids: string[]
        car_id: string
        cliente_id: string
      }>
    }) => updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] })
    },
  })
}

// Hook para atualizar apenas o status do budget
export function useUpdateBudgetStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBudgetStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] })
    },
  })
}


// Hook para deletar um budget
export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] })
    },
  })
}
