import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import BudgetModal from "@/components/modal"
import BudgetCard from "@/components/BudgetCardList"

// Dados de exemplo
const orcamentos = [
  { id: 1, preco: "R$ 150,00", origem: "São Paulo - SP", destino: "Campinas - SP", carro: "Honda Civic 2022", motorista: "Carlos Silva", cliente: "Empresa ABC Ltda", dia: "15/01/2024", hora: "14:30", status: "Aprovada" },
  { id: 2, preco: "R$ 280,00", origem: "Rio de Janeiro - RJ", destino: "Petrópolis - RJ", carro: "Toyota Corolla 2023", motorista: "Ana Santos", cliente: "Maria Fernanda", dia: "16/01/2024", hora: "09:15", status: "Pendente" },
  { id: 3, preco: "R$ 320,00", origem: "Belo Horizonte - MG", destino: "Ouro Preto - MG", carro: "Volkswagen Jetta 2021", motorista: "Pedro Costa", cliente: "Construtora XYZ", dia: "17/01/2024", hora: "16:45", status: "Aprovada" },
  { id: 4, preco: "R$ 95,00", origem: "Salvador - BA", destino: "Feira de Santana - BA", carro: "Hyundai HB20 2022", motorista: "Maria Oliveira", cliente: "João Roberto", dia: "18/01/2024", hora: "11:20", status: "Cancelada" },
  { id: 5, preco: "R$ 420,00", origem: "Brasília - DF", destino: "Goiânia - GO", carro: "Chevrolet Onix 2023", motorista: "João Pereira", cliente: "Hotel Brasília", dia: "19/01/2024", hora: "08:00", status: "Aprovada" },
]

export default function BudgetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
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
                {orcamentos.filter((v) => v.status === "Aprovada").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {orcamentos.filter((v) => v.status === "Pendente").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Canceladas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {orcamentos.filter((v) => v.status === "Cancelada").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <BudgetModal open={isModalOpen} onOpenChange={setIsModalOpen} />

        {/* Lista de viagens - 1 card por linha sempre */}
        <div className="flex flex-col gap-6">
          {orcamentos.map((orcamento) => (
            <BudgetCard key={orcamento.id} orcamentos={orcamento} />
          ))}
        </div>
      </div>
    </>
  )
}
