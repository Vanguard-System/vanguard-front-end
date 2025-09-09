"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useCreateClient } from "@/services/hooks/useClient"


interface ClientData {
  name: string
  email: string
  telephone: string
}

export function FormClientRegister() {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    email: "",
    telephone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const createClientMutation = useCreateClient()

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }


  const handleInputChange = (field: keyof ClientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" })
      return
    }

    if (!formData.telephone.trim()) {
      toast({ title: "Erro", description: "Telefone é obrigatório", variant: "destructive" })
      return
    }

    if (!validateEmail(formData.email)) {
      toast({ title: "Erro", description: "Email inválido", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
   
    try {
      await createClientMutation.mutateAsync(formData)
      toast({ title: "Sucesso", description: "Cliente cadastrado com sucesso" })
      setFormData({ name: "", email: "", telephone: "" })
    } catch (error: any) {
      console.error("Erro ao cadastrar cliente:", error) // <-- loga o erro real
      toast({ title: "Erro", description: "Falha ao cadastrar cliente", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <div className="flex justify-center mt-24 px-4 sm:px-6 lg:px-0 ml-0 md:ml-64">
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
                  onChange={e => handleInputChange("name", e.target.value)}
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
                <Label htmlFor="telephone">Telefone</Label>
                <Input
                  id="telephone"
                  type="text"
                  placeholder="(DDD) 999999999"
                  value={formData.telephone}
                  onChange={e => handleInputChange("telephone", e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Cliente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
