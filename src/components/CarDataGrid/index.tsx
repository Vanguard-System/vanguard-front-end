"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, CreditCard, Edit, Trash2, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCar, useUpdateCar, useDeleteCar } from "@/services/hooks/useCar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Car {
  id: string
  model: string
  plate: string
  consumption: number
  fixedCost: number
}

export function CarDataGrid() {
  const { data: cars = [] } = useCar()
  const updateCarMutation = useUpdateCar()
  const deleteCarMutation = useDeleteCar()
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Car | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(cars.length / itemsPerPage)
  const paginatedCars = cars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const startEdit = (car: Car) => {
    setEditingId(car.id)
    setFormData({ ...car })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData(null)
  }

  const saveEdit = async () => {
    if (!formData) return
    try {
      await updateCarMutation.mutateAsync({ id: formData.id, data: formData })
      toast({ title: "Sucesso", description: "Carro atualizado com sucesso" })
      cancelEdit()
    } catch {
      toast({ title: "Erro", description: "Falha ao atualizar carro", variant: "destructive" })
    }
  }

  const handleChange = (field: keyof Car, value: string) => {
    if (!formData) return
    setFormData(prev => (prev ? { ...prev, [field]: value } : null))
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCarMutation.mutateAsync(id)
      toast({ title: "Sucesso", description: "Carro deletado com sucesso" })
    } catch {
      toast({ title: "Erro", description: "Falha ao deletar carro", variant: "destructive" })
    }
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col flex-1 p-4 md:p-6 ml-0 md:ml-64">
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6">Carros cadastrados</h2>

      {/* Tabela Desktop */}
      <div className="hidden md:flex flex-1 overflow-auto rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Modelo
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Placa
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Consumo
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Custo Fixo
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCars.map((car: Car) => {
              const isEditing = editingId === car.id
              return (
                <TableRow key={car.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input value={formData?.model || ""} onChange={e => handleChange("model", e.target.value)} className="h-8" />
                    ) : (
                      <span>{car.model}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input value={formData?.plate || ""} onChange={e => handleChange("plate", e.target.value)} className="h-8" />
                    ) : (
                      <span>{car.plate}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input value={formData?.consumption || ""} onChange={e => handleChange("consumption", e.target.value)} className="h-8" />
                    ) : (
                      <span>{car.consumption}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input value={formData?.fixedCost || ""} onChange={e => handleChange("fixedCost", e.target.value)} className="h-8" />
                    ) : (
                        <span>{car.fixedCost}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={saveEdit} className="h-8 px-3 hover:bg-green-50 hover:text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 px-3 hover:bg-gray-50 hover:text-gray-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => startEdit(car)} className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(car.id)} className="h-8 px-3 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Paginação Desktop */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-end items-center gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Cards Mobile */}
      <div className="md:hidden flex flex-col gap-4 overflow-auto">
        {paginatedCars.map((car: Car) => {
          const isEditing = editingId === car.id
          return (
            <div key={car.id} className="bg-card border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" /> Modelo
                </div>
                {isEditing ? (
                  <Input value={formData?.model || ""} onChange={e => handleChange("model", e.target.value)} className="h-9" />
                ) : (
                  <p className="font-medium">{car.model}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CreditCard className="h-4 w-4" /> Placa
                </div>
                {isEditing ? (
                  <Input value={formData?.plate || ""} onChange={e => handleChange("plate", e.target.value)} className="h-9" />
                ) : (
                  <p>{car.plate}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CreditCard className="h-4 w-4" /> Consumo
                </div>
                {isEditing ? (
                  <Input value={formData?.plate || 0} onChange={e => handleChange("consumption", e.target.value)} className="h-9" />
                ) : (
                  <p>{car.consumption}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CreditCard className="h-4 w-4" /> Custo Fixo
                </div>
                {isEditing ? (
                  <Input value={formData?.fixedCost || 0} onChange={e => handleChange("fixedCost", e.target.value)} className="h-9" />
                ) : (
                  <p>{car.consumption}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={saveEdit} className="h-9 px-4 hover:bg-green-50 hover:text-green-600">
                      <Check className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-9 px-4 hover:bg-gray-50 hover:text-gray-600">
                      <X className="h-4 w-4 mr-2" /> Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(car)} className="h-9 px-4 hover:bg-blue-50 hover:text-blue-600">
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(car.id)} className="h-9 px-4 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Paginação Mobile */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{currentPage}/{totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {cars.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Nenhum carro cadastrado</div>
      )}
    </div>
  )
}
