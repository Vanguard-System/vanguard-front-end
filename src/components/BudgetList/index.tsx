import { useBudget, useDeleteBudget, useUpdateBudget } from "@/services/hooks/useBudget"
import BudgetCard from "../BudgetCard"
import type { Orcamento } from "@/types/orcamento"

export default function BudgetList() {
  const { data: orcamentos = [], isLoading } = useBudget()
  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="space-y-4">
      {orcamentos.map((orcamento: Orcamento) => (
        <BudgetCard
          key={orcamento.id}
          orcamento={orcamento}
          updateBudget={updateBudget}
          deleteBudget={deleteBudget}
        />
      ))}
    </div>
  )
}
