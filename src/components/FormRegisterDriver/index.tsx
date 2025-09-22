"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface DriverData {
  name: string
  cpf: string
  email: string
  paymentType: string
}

export function DriverRegistrationForm() {
  const [formData, setFormData] = useState<DriverData>({
    name: "",
    cpf: "",
    email: "",
    paymentType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  const validateCPF = (cpf: string) => cpf.replace(/\D/g, "").length === 11
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleInputChange = (field: keyof DriverData, value: string) => {
    if (field === "cpf") value = formatCPF(value)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" })
      return
    }
    if (!validateCPF(formData.cpf)) {
      toast({ title: "Erro", description: "CPF inválido", variant: "destructive" })
      return
    }
    if (!validateEmail(formData.email)) {
      toast({ title: "Erro", description: "Email inválido", variant: "destructive" })
      return
    }
    if (!formData.paymentType) {
      toast({ title: "Erro", description: "Tipo de pagamento obrigatório", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: "Sucesso", description: "Motorista cadastrado com sucesso" })
      setFormData({ name: "", cpf: "", email: "", paymentType: "" })
    } catch {
      toast({ title: "Erro", description: "Falha ao cadastrar motorista", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 p-4 md:p-6 ml-0 mt-20 md:ml-64">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dados do Motorista</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={e => handleInputChange("cpf", e.target.value)}
                  maxLength={14}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Tipo de Pagamento</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={value => handleInputChange("paymentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagamento-fixo">Pagamento Fixo</SelectItem>
                    <SelectItem value="pagamento-por-viagem">Pagamento por Viagem</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Motorista"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
