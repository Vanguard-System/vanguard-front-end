"use client"

import type React from "react"
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
}

export function CarRegisterForm() {
  const [formData, setFormData] = useState<CarData>({
    model: "",
    plate: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const createCarMutation = useCreateCar()

  const handleInputChange = (field: keyof CarData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.model.trim()) {
      toast({ title: "Erro", description: "Modelo é obrigatório", variant: "destructive" })
      return
    }

    if (!formData.plate) {
      toast({ title: "Erro", description: "Placa é obrigatório", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      await createCarMutation.mutateAsync(formData)
      toast({ title: "Sucesso", description: "Cliente cadastrado com sucesso" })
    } 
    catch {
      setFormData({ model: "", plate: "" })
      toast({ title: "Erro", description: "Falha ao cadastrar carro", variant: "destructive" })
    } 
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center mt-24 px-4 sm:px-6 lg:px-0 ml-0 md:ml-64">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Dados do carro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o modelo do carro"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Placa</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="Digite a placa do carro"
                  value={formData.plate}
                  onChange={(e) => handleInputChange("plate", e.target.value)}
                  maxLength={14}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar carro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
