import { fixLocalDateTime } from "@/helper/dateHelper"
import api from "./api"

// Pega todos os budgets
export async function getBudget() {
  const { data } = await api.get("/budget")
  return data
}

// Pega a viagem relacionada a um budget
export async function getTripFromBudget() {
  const { data } = await api.get("/budget/trips")
  return data
}

// Cria um budget (novo formato esperado pelo backend)
export async function createBudget(budgetData: {
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
}) {
  const payload = {
    ...budgetData,
    data_hora_viagem: fixLocalDateTime(budgetData.data_hora_viagem),
    data_hora_viagem_retorno: budgetData.data_hora_viagem_retorno
      ? fixLocalDateTime(budgetData.data_hora_viagem_retorno)
      : "",
  }

  const { data } = await api.post("/budget", payload)
  return data
}

export async function updateBudget(
  id: string,
  budgetData: Partial<{
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
  }>
) {
  const payload = { ...budgetData }

  if (budgetData.data_hora_viagem) {
    payload.data_hora_viagem = fixLocalDateTime(budgetData.data_hora_viagem)
  }

  if (budgetData.data_hora_viagem_retorno) {
    payload.data_hora_viagem_retorno = fixLocalDateTime(
      budgetData.data_hora_viagem_retorno
    )
  }

  const { data } = await api.put(`/budget/${id}`, payload)
  return data
}

export async function updateBudgetStatus(
  id: string,
  statusData: { status: string }
) {
  const { data } = await api.patch(`/budget/${id}/status`, statusData)
  return data
}

// Deleta um budget
export async function deleteBudget(id: string) {
  const { data } = await api.delete(`/budget/${id}`)
  return data
}
