import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BudgetModal from "@/components/modal"
import { useBudgetTrips } from "@/services/hooks/useBudget"
import TripCard from "@/components/TripCard"
import type { BudgetTrip } from "@/types/trip"
import title from "@/assets/title.jpeg" // importa a imagem

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: trip = [], isLoading } = useBudgetTrips()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(trip.length / itemsPerPage)
  const paginatedOrcamentos = trip.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="ml-0 lg:ml-64 p-4 mt-10 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lista de Viagens</h1>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8 items-center">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{trip.length}</div>
          </CardContent>
        </Card>

        {/* Imagem ao lado do card */}
        <div className="flex justify-center items-center">
          <img src={title} alt="Imagem teste" className="max-h-32 object-contain" />
        </div>
      </div>

      {/* Modal de cadastro */}
      <BudgetModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* Lista de orçamentos com paginação */}
      <div className="flex flex-col gap-6">
        {paginatedOrcamentos.map((trip: BudgetTrip) => (
          <TripCard
            key={trip.id}
            trip={trip}
          />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
