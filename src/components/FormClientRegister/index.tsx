"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ClientData {
  name: string
  telefone: string
  email: string
}

export function FormClientRegister() {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    telefone: "",
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" })
      return
    }
    
    if (!formData.telefone) {
      toast({ title: "Erro", description: "Telefone é obrigatório", variant: "destructive" })
      return
    }

    if (!validateEmail(formData.email)) {
      toast({ title: "Erro", description: "Email inválido", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({ title: "Sucesso", description: "Cliente cadastrado com sucesso" })
      setFormData({ name: "", telefone: "", email: "" })
    }
     catch {
      toast({ title: "Erro", description: "Falha ao cadastrar cliente", variant: "destructive" })
    } 
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex justify-center mt-16 px-4 sm:px-6 lg:px-0">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="telefone"
                  placeholder="(DDD) 999999999"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
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
