import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BudgetModal from "@/components/modal"

import { useBudget, useUpdateBudget, useDeleteBudget } from "@/services/hooks/useBudget"
import type { Orcamento } from "@/types/orcamento"
import BudgetCard from "@/components/BudgetCard"

export default function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading } = useBudget()
  const orcamentos: Orcamento[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.orcamentos)
      ? data.orcamentos
      : []

  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(orcamentos.length / itemsPerPage)
  const paginatedOrcamentos = orcamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (isLoading) return <p>Carregando...</p>

  console.log('fui pra prod')

  return (
    <div className="ml-0 lg:ml-64 p-4 mt-10 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lista de Orçamentos</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-8 w-full">
        <Card className="flex flex-col justify-center items-center h-32 shadow-md hover:shadow-lg transition-all duration-200 w-full">
          <CardHeader className="pb-1 text-center">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-600">
              Total de Orçamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {orcamentos.length}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center items-center h-32 shadow-md hover:shadow-lg transition-all duration-200 w-full">
          <CardHeader className="pb-1 text-center">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-600">
              Aprovadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {(orcamentos ?? []).filter((v: any) => v.status === "Aprovada").length}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center items-center h-32 shadow-md hover:shadow-lg transition-all duration-200 w-full">
          <CardHeader className="pb-1 text-center">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-600">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {(orcamentos ?? []).filter((v: any) => v.status === "Pendente").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <BudgetModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <div className="flex flex-col gap-6">
        {paginatedOrcamentos.length > 0 ? (
          paginatedOrcamentos.map((orcamento: Orcamento) => (
            <BudgetCard
              key={orcamento.id}
              orcamento={orcamento}
              updateBudget={updateBudget}
              deleteBudget={deleteBudget}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum orçamento encontrado.</p>
        )}
      </div>

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
