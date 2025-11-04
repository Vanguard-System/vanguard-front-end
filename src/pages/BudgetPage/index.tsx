import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BudgetModal from "@/components/modal"

import { useBudget, useUpdateBudget, useDeleteBudget } from "@/services/hooks/useBudget"
import type { Orcamento } from "@/types/orcamento"
import BudgetCard from "@/components/BudgetCard"

export default function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: orcamentos = [], isLoading } = useBudget()
  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(orcamentos.length / itemsPerPage)
  const paginatedOrcamentos = orcamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="ml-0 lg:ml-64 p-4 mt-10 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lista de Orçamentos</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Novo Orçamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{orcamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {orcamentos.filter((v: any) => v.status === "Aprovada").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {orcamentos.filter((v: any) => v.status === "Pendente").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {orcamentos.filter((v: any) => v.status === "Cancelada").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de cadastro */}
      <BudgetModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* Lista de orçamentos com paginação */}
      <div className="flex flex-col gap-6">
        {paginatedOrcamentos.map((orcamento: Orcamento) => (
          <BudgetCard
            key={orcamento.id}
            orcamento={orcamento}
            updateBudget={updateBudget}
            deleteBudget={deleteBudget}
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
