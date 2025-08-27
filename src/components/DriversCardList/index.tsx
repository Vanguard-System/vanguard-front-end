"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, CreditCard, Edit, Trash2, FileText, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Driver {
  id: string
  name: string
  cpf: string
  email: string
  paymentType: string
}

const mockDrivers: Driver[] = [
  { id: "1", name: "João Silva Santos", cpf: "123.456.789-01", email: "joao.silva@email.com", paymentType: "pagamento-fixo" },
  { id: "2", name: "Peter Parker", cpf: "987.654.321-09", email: "peterparker@email.com", paymentType: "pagamento-por-viagem" }, 
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
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Driver | null>(null)

  const startEdit = (driver: Driver) => {
    setEditingId(driver.id)
    setFormData({ ...driver })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData(null)
  }

  const saveEdit = () => {
    if (formData) {
      setDrivers(prev => prev.map(d => (d.id === formData.id ? formData : d)))
    }
    cancelEdit()
  }

  const handleChange = (field: keyof Driver, value: string) => {
    if (!formData) return
    setFormData(prev => (prev ? { ...prev, [field]: value } : null))
  }

  const handleDelete = (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id))
  }

  const handleGeneratePayroll = (id: string) => {
    console.log("Gerar holerite para motorista:", id)
  }

  return (
    <div className="ml-0 md:ml-64 space-y-6 px-4 md:px-6 py-6 max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-semibold text-center">Motoristas Cadastrados</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {drivers.map((driver) => {
          const isEditing = editingId === driver.id
          return (
            <Card key={driver.id} className="hover:shadow-md transition-shadow w-full max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col items-center gap-2 text-lg">
                  <User className="h-5 w-5 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.name || ""}
                      onChange={e => handleChange("name", e.target.value)}
                    />
                  ) : (
                    <span>{driver.name}</span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 flex flex-col items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.cpf || ""}
                      onChange={e => handleChange("cpf", e.target.value)}
                    />
                  ) : (
                    <span>CPF: {driver.cpf}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.email || ""}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                  ) : (
                    <span>{driver.email}</span>
                  )}
                </div>

                <div className="pt-2">
                  {isEditing ? (
                    <Select
                      value={formData?.paymentType || ""}
                      onValueChange={(value) => handleChange("paymentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pagamento-fixo">Pagamento Fixo</SelectItem>
                        <SelectItem value="pagamento-por-viagem">Pagamento por Viagem</SelectItem>
                        <SelectItem value="outra-coisa">Outra Coisa</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={getPaymentTypeBadgeVariant(driver.paymentType)}>
                      {getPaymentTypeLabel(driver.paymentType)}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveEdit}
                        className="h-8 px-3 hover:bg-green-50 hover:text-green-600"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                        className="h-8 px-3 hover:bg-gray-50 hover:text-gray-600"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGeneratePayroll(driver.id)}
                        className="h-8 px-3 hover:bg-green-50 hover:text-green-600"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Holerite Salarial
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(driver)}
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
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
