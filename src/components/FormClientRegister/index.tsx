"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateClient } from "@/services/hooks/useClient"
import BackendAlert from "@/components/BackendAlert"

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
  const [alert, setAlert] = useState<{ status: 'success' | 'error'; message: string } | null>(null)
  const createClientMutation = useCreateClient()

  const validateEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setAlert({ status: "error", message: "Nome é obrigatório" })
      return
    }
    if (!formData.telephone.trim()) {
      setAlert({ status: "error", message: "Telefone é obrigatório" })
      return
    }
    if (!validateEmail(formData.email)) {
      setAlert({ status: "error", message: "Email inválido" })
      return
    }

    setIsSubmitting(true)
    try {
      await createClientMutation.mutateAsync(formData)
      setAlert({ status: "success", message: "Cliente cadastrado com sucesso" })
      setFormData({ name: "", email: "", telephone: "" })
    } catch {
      setAlert({ status: "error", message: "Falha ao cadastrar cliente" })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  return (
    <div className="flex flex-1 p-4 md:p-6 ml-0 mt-20 md:ml-64">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
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

      {/* Alerta Backend */}
      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-50">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}
    </div>
  )
}
