"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, CreditCard, Edit, Trash2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input" // precisa existir no seu projeto

interface Car {
  id: string
  modelo: string
  placa: string
}

const mockCar: Car[] = [
  { id: "1", modelo: "Red Bull Oracle", placa: "Verstappen" },
  { id: "2", modelo: "Mclaren", placa: "Senna" },
]

export function CarCards() {
  const [cars, setCars] = useState<Car[]>(mockCar)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Car | null>(null)

  const startEdit = (car: Car) => {
    setEditingId(car.id)
    setFormData({ ...car })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData(null)
  }

  const saveEdit = () => {
    if (formData) {
      setCars(prev => prev.map(c => (c.id === formData.id ? formData : c)))
    }
    cancelEdit()
  }

  const handleChange = (field: keyof Car, value: string) => {
    if (!formData) return
    setFormData(prev => (prev ? { ...prev, [field]: value } : null))
  }

  const handleDelete = (id: string) => {
    setCars(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="ml-0 md:ml-64 space-y-6 px-4 md:px-6 py-6 max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-semibold">Carros cadastrados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center w-full">
        {cars.map((car) => {
          const isEditing = editingId === car.id
          return (
            <Card key={car.id} className="hover:shadow-md transition-shadow w-full max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col items-center gap-2 text-lg">
                  <User className="h-5 w-5 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.modelo || ""}
                      onChange={e => handleChange("modelo", e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <span>{car.modelo}</span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 flex flex-col items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.placa || ""}
                      onChange={e => handleChange("placa", e.target.value)}
                    />
                  ) : (
                    <span>Placa: {car.placa}</span>
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
                        onClick={() => startEdit(car)}
                        className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(car.id)}
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
