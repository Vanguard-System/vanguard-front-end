import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBudgetTrips } from "@/services/hooks/useBudget"
import TripCard from "@/components/TripCard"
import type { BudgetTrip } from "@/types/trip"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts"

export default function Page() {
  const { data, isLoading } = useBudgetTrips()
  const trip: BudgetTrip[] = Array.isArray(data) ? data : []

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(trip.length / itemsPerPage)
  const paginatedTrips = trip.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const destinosData = useMemo(() => {
    const grouped: Record<string, number> = {}

    if (Array.isArray(trip)) {
      trip.forEach((t: any) => {
        if (t?.destino) grouped[t.destino] = (grouped[t.destino] || 0) + 1
      })
    }

    return Object.entries(grouped)
      .map(([name, Quantidade]) => ({ name, Quantidade }))
      .sort((a, b) => b.Quantidade - a.Quantidade)
  }, [trip])

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="ml-0 lg:ml-64 p-4 mt-10 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lista de Viagens</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-8 items-stretch">
        <Card className="w-full sm:w-1/4 flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Total de Orçamentos
            </CardTitle>
            <div className="text-3xl font-bold text-gray-900 text-center">
              {trip.length}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Viagens por Destino
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32">
            {destinosData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={destinosData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis type="number" hide />
                  <Tooltip />
                  <Bar dataKey="Quantidade" radius={[3, 3, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-gray-500 mt-6">
                Nenhum dado disponível.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        {paginatedTrips.length > 0 ? (
          paginatedTrips.map((trip: BudgetTrip) => (
            <TripCard key={trip.id} trip={trip} />
          ))
        ) : (
          <p className="text-center text-gray-500">
            Nenhuma viagem encontrada.
          </p>
        )}
      </div>

      <div className="flex justify-center items-center mt-6 gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
