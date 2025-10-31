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
  driver_id: string
  car_id: string
  cliente_id: string
}) {
  const { data } = await api.post("/budget", budgetData)
  return data
}

// Atualiza um budget
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
    driver_id: string
    car_id: string
    cliente_id: string
  }>
) {
  const { data } = await api.put(`/budget/${id}`, budgetData)
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
