"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface CarData {
  modelo: string
  placa: string
}

export function CarRegisterForm() {
  const [formData, setFormData] = useState<CarData>({
    modelo: "",
    placa: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof CarData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.modelo.trim()) {
      toast({ title: "Erro", description: "Modelo é obrigatório", variant: "destructive" })
      return
    }

    if (!formData.placa) {
      toast({ title: "Erro", description: "Placa é obrigatório", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({ title: "Sucesso", description: "Carro cadastrado com sucesso" })
      setFormData({ modelo: "", placa: "" })
    } 
    catch {
      toast({ title: "Erro", description: "Falha ao cadastrar carro", variant: "destructive" })
    } 
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex justify-center mt-16 px-4 sm:px-6 lg:px-0">
      <Card className="w-full max-w-4xl">
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
                  value={formData.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Placa</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="Digite a placa do carro"
                  value={formData.placa}
                  onChange={(e) => handleInputChange("placa", e.target.value)}
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
