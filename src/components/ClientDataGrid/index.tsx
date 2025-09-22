"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Edit, Trash2, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useClient, useDeleteClient, useUpdateClient } from "@/services/hooks/useClient"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Client {
  id: string
  name: string
  telephone: string
  email: string
}

export function ClientDataGrid() {
  const { data: clients = [] } = useClient()
  const updateClientMutation = useUpdateClient()
  const deleteClientMutation = useDeleteClient()
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Client | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 
  const totalPages = Math.ceil(clients.length / itemsPerPage)
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClientMutation.mutateAsync(id)
      toast({ title: "Sucesso", description: "Cliente deletado com sucesso" })
    } catch {
      toast({ title: "Erro", description: "Falha ao deletar cliente", variant: "destructive" })
    }
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col flex-1 p-4 md:p-6 ml-0 md:ml-64">
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6">Clientes cadastrados</h2>

      {/* Tabela desktop */}
      {/* Tabela desktop */}
      <div className="hidden md:flex flex-1 overflow-auto rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client: Client) => {
              const isEditing = editingId === client.id
              return (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input
                        value={formData?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>{client.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={formData?.telephone || ""}
                        onChange={(e) => handleChange("telephone", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>{client.telephone}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={formData?.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>{client.email}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveEdit}
                            className="h-8 px-3 hover:bg-green-50 hover:text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="h-8 px-3 hover:bg-gray-50 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
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
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            className="h-8 px-3 hover:bg-red-50 hover:text-red-600"
                          >
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

      {/* Paginação Desktop fora da tabela */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-end items-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Cards mobile */}
      <div className="md:hidden flex flex-col gap-4 overflow-auto">
        {paginatedClients.map((client: Client) => {
          const isEditing = editingId === client.id
          return (
            <div key={client.id} className="bg-card border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Nome
                </div>
                {isEditing ? (
                  <Input
                    value={formData?.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <p className="font-medium">{client.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Telefone
                </div>
                {isEditing ? (
                  <Input
                    value={formData?.telephone || ""}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <p>{client.telephone}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                {isEditing ? (
                  <Input
                    value={formData?.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <p className="break-all">{client.email}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveEdit}
                      className="h-9 px-4 hover:bg-green-50 hover:text-green-600"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                      className="h-9 px-4 hover:bg-gray-50 hover:text-gray-600"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(client)}
                      className="h-9 px-4 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      className="h-9 px-4 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cliente cadastrado
        </div>
      )}
    </div>
  )
}
