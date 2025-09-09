"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, CreditCard, Edit, Trash2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useClient, useDeleteClient, useUpdateClient } from "@/services/hooks/useClient"


interface Client {
  id: string
  name: string
  telephone: string
  email: string
}

export function ClientCards() {
  const { data: clients = [] } = useClient()
  const updateClientMutation = useUpdateClient()
  const deleteClientMutation = useDeleteClient()
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Client | null>(null)

  const startEdit = (client: Client) => {
    setEditingId(client.id)
    setFormData({ ...client })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData(null)
  }

  const saveEdit = async () => {
    if (!formData) return
    try {
      await updateClientMutation.mutateAsync({ id: formData.id, data: formData })
      toast({ title: "Sucesso", description: "Cliente atualizado com sucesso" })
      cancelEdit()
    } catch {
      toast({ title: "Erro", description: "Falha ao atualizar cliente", variant: "destructive" })
    }
  }

  const handleChange = (field: keyof Client, value: string) => {
    if (!formData) return
    setFormData(prev => (prev ? { ...prev, [field]: value } : null))
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClientMutation.mutateAsync(id)
      toast({ title: "Sucesso", description: "Cliente deletado com sucesso" })
    } catch {
      toast({ title: "Erro", description: "Falha ao deletar cliente", variant: "destructive" })
    }
  }

  return (
    <div className="ml-0 md:ml-64 space-y-6 px-4 md:px-6 py-6 max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-semibold text-center">Clientes cadastrados</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {clients.map((client: Client) => {
          const isEditing = editingId === client.id
          return (
            <Card key={client.id} className="hover:shadow-md transition-shadow w-full max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col items-center gap-2 text-lg">
                  <User className="h-5 w-5 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.name || ""}
                      onChange={e => handleChange("name", e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <span>{client.name}</span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 flex flex-col items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.telephone || ""}
                      onChange={e => handleChange("telephone", e.target.value)}
                    />
                  ) : (
                    <span>Telefone: {client.telephone}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  {isEditing ? (
                    <Input
                      value={formData?.email || ""}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                  ) : (
                    <span>{client.email}</span>
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
                        onClick={() => startEdit(client)}
                        className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
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
