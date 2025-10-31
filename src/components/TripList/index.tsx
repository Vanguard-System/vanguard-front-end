import { useBudget, useDeleteBudget, useUpdateBudget } from "@/services/hooks/useBudget"
import BudgetCard from "../BudgetCard"
import type { BudgetTrip } from "@/types/trip"
import TripCard from "../TripCard"

export default function BudgetList() {
  const { data: orcamentos = [], isLoading } = useBudget()

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="space-y-4">
      {orcamentos.map((trip: BudgetTrip) => (
        <TripCard
          key={trip.id}
          trip={trip}
        />
      ))}
    </div>
  )
}
