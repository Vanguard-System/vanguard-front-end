"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, CreditCard, Edit, Trash2, FileText } from "lucide-react"

interface Driver {
  id: string
  name: string
  cpf: string
  email: string
  paymentType: string
}

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "João Silva Santos",
    cpf: "123.456.789-01",
    email: "joao.silva@email.com",
    paymentType: "pagamento-fixo",
  },
  {
    id: "2",
    name: "Peter Parker",
    cpf: "987.654.321-09",
    email: "peterparker@email.com",
    paymentType: "pagamento-por-viagem",
  },
]

const getPaymentTypeLabel = (type: string) => {
  switch (type) {
    case "pagamento-fixo":
      return "Pagamento Fixo"
    case "pagamento-por-viagem":
      return "Pagamento por Viagem"
    case "outra-coisa":
      return "Outra Coisa"
    default:
      return type
  }
}

const getPaymentTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "pagamento-fixo":
      return "default"
    case "pagamento-por-viagem":
      return "secondary"
    case "outra-coisa":
      return "outline"
    default:
      return "default"
  }
}

export function DriverCards() {
  const handleEdit = (driverId: string) => {
    console.log("Editar motorista:", driverId)
    // Implementar lógica de edição aqui
  }

  const handleDelete = (driverId: string) => {
    console.log("Excluir motorista:", driverId)
    // Implementar lógica de exclusão aqui
  }

  const handleGeneratePayroll = (driverId: string) => {
    console.log("Gerar holerite para motorista:", driverId)
    // Implementar lógica de geração de holerite aqui
  }

  return (
    <div className="ml-64 space-y-6 px-4 md:px-6 py-6 max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-semibold">Motoristas Cadastrados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {mockDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-shadow w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 shrink-0" />
                <span>{driver.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>CPF: {driver.cpf}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{driver.email}</span>
              </div>

              <div className="pt-2">
                <Badge variant={getPaymentTypeBadgeVariant(driver.paymentType)}>
                  {getPaymentTypeLabel(driver.paymentType)}
                </Badge>
              </div>

              <div className="flex items-center ml-10 gap-2 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGeneratePayroll(driver.id)}
                  className="h-8 px-3 hover:bg-green-50 hover:text-green-600"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Holerite Salarial
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(driver.id)}
                    className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(driver.id)}
                    className="h-8 px-3 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
