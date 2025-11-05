"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateCar } from "@/services/hooks/useCar"
import BackendAlert from "@/components/BackendAlert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface CarData {
  model: string
  plate: string
  consumption: number
  fixed_cost: number
}

export function CarRegisterForm() {
  const [formData, setFormData] = useState<CarData>({
    model: "",
    plate: "",
    consumption: 0,
    fixed_cost: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ status: 'success' | 'error'; message: string } | null>(null)

  const createCarMutation = useCreateCar()

  // Auto-hide alert after 4s
  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  const handleInputChange = (field: keyof CarData, value: string) => {
    // Converte números corretamente
    if (field === "consumption" || field === "fixed_cost") {
      const num = parseFloat(value)
      setFormData(prev => ({ ...prev, [field]: isNaN(num) ? 0 : num }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.model.trim()) {
      setAlert({ status: "error", message: "Modelo é obrigatório" })
      return
    }

    if (!formData.plate.trim()) {
      setAlert({ status: "error", message: "Placa é obrigatória" })
      return
    }

    setIsSubmitting(true)

    try {
      await createCarMutation.mutateAsync(formData)
      setAlert({ status: "success", message: "Carro cadastrado com sucesso" })
      setFormData({ model: "", plate: "", consumption: 0, fixed_cost: 0 })
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Falha ao cadastrar carro"
      setAlert({ status: "error", message: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 p-4 md:p-6 ml-0 mt-20 md:ml-64 relative">
      {/* Alert Backend */}
      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-50">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dados do Carro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center gap-1">
                  <Label htmlFor="consumption">Consumo</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Informe o consumo médio do veículo por km (ex: 2.5 ou 8).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="consumption"
                  type="number"
                  placeholder="Digite o consumo do veículo"
                  value={formData.consumption}
                  onChange={e => handleInputChange("consumption", e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="fixed_cost">Preço fixo</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Digite o custo fixo mensal para manter o veículo (ex: seguro, documentação, etc.).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="fixed_cost"
                  type="number"
                  placeholder="Digite o custo fixo do veículo"
                  value={formData.fixed_cost}
                  onChange={e => handleInputChange("fixed_cost", e.target.value)}
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
