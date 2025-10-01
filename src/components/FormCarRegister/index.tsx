"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useCreateCar } from "@/services/hooks/useCar"

interface CarData {
  model: string
  plate: string
  consumption: number
}

export function CarRegisterForm() {
  const [formData, setFormData] = useState<CarData>({
    model: "",
    plate: "",
    consumption: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const createCarMutation = useCreateCar()

  const handleInputChange = (field: keyof CarData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.model.trim()) {
      toast({ title: "Erro", description: "Modelo é obrigatório", variant: "destructive" })
      return
    }

    if (!formData.plate.trim()) {
      toast({ title: "Erro", description: "Placa é obrigatória", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      await createCarMutation.mutateAsync(formData)
      toast({ title: "Sucesso", description: "Carro cadastrado com sucesso" })
      setFormData({ model: "", plate: "", consumption: 0 })
    } catch {
      toast({ title: "Erro", description: "Falha ao cadastrar carro", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 p-4 md:p-6 ml-0 mt-20 md:ml-64">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dados do Carro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  type="text"
                  placeholder="Digite o modelo do carro"
                  value={formData.model}
                  onChange={e => handleInputChange("model", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  type="text"
                  placeholder="Digite a placa do carro"
                  value={formData.plate}
                  onChange={e => handleInputChange("plate", e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consumption">Consumo</Label>
                <Input
                  id="consumption"
                  type="text"
                  placeholder="Digite o consumo do veículo"
                  value={formData.consumption}
                  onChange={e => handleInputChange("consumption", e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Carro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
