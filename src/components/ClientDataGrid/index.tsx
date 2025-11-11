"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Edit, Trash2, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useClient, useDeleteClient, useUpdateClient } from "@/services/hooks/useClient"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import BackendAlert from "@/components/BackendAlert"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog"
import { DialogFooter, DialogHeader } from "../ui/dialog"

interface Client {
  id: string
  name: string
  telephone: string
  email: string
}

export function ClientDataGrid() {
  const { data } = useClient()
  const clients = Array.isArray(data)
    ? data
    : Array.isArray(data?.clients)
      ? data.clients
      : []
  const updateClientMutation = useUpdateClient()
  const deleteClientMutation = useDeleteClient()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Client | null>(null)
  const [alert, setAlert] = useState<{ status: 'success' | 'error'; message: string } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(clients.length / itemsPerPage)
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

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
      setAlert({ status: "success", message: "Cliente atualizado com sucesso" })
      cancelEdit()
    } catch {
      setAlert({ status: "error", message: "Falha ao atualizar cliente" })
    }
  }

  const handleChange = (field: keyof Client, value: string) => {
    if (!formData) return
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client)
    setDeleteConfirmOpen(true)
  }


  const confirmDelete = async () => {
    if (!clientToDelete) return
    try {
      await deleteClientMutation.mutateAsync(clientToDelete.id)
      setAlert({ status: "success", message: "Cliente deletado com sucesso" })
    } catch (error: any) {
      console.error("Erro ao deletar cliente:", error)

      if (error.response?.data?.message?.includes("foreign key")) {
        setAlert({
          status: "error",
          message: "Não é possível deletar este cliente porque ele está vinculado a um orçamento.",
        })
      }
      else {
        setAlert({ status: "error", message: "Falha ao deletar cliente" })
      }
    } 
    finally {
      setDeleteConfirmOpen(false)
      setClientToDelete(null)
    }
  }


  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col flex-1 p-4 md:p-6 ml-0 md:ml-64">
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6">
        Clientes cadastrados
      </h2>

      {/* Tabela Desktop */}
      <div className="hidden md:flex flex-1 overflow-auto rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Nome
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telefone
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client: any) => {
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
                            onClick={() => handleDeleteClick(client)}
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

      {/* 🔽 Paginação Desktop (fora da tabela) */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-center items-center gap-4 py-4">
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

      {/* Cards mobile */}
      <div className="md:hidden flex flex-col gap-4 overflow-auto">
        {paginatedClients.map((client: any) => {
          const isEditing = editingId === client.id
          return (
            <div key={client.id} className="bg-card border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" /> Nome
                </div>
                {isEditing ? (
                  <Input
                    value={formData?.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-9"
                  />
                ) : (
                  <p>{client.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Phone className="h-4 w-4" /> Telefone
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
                  <Mail className="h-4 w-4" /> Email
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
                      <Check className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                      className="h-9 px-4 hover:bg-gray-50 hover:text-gray-600"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancelar
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
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(client)}
                      className="h-9 px-4 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
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

      {/* Dialog e Alert (inalterado) */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed inset-0 flex items-center justify-center z-[1000] px-4">
            <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 relative">
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600 mt-2">
                Tem certeza que deseja excluir o cliente{" "}
                <strong>{clientToDelete?.name}</strong>?
              </p>
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="w-24"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="w-24"
                >
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </div>
        </DialogPortal>
      </Dialog>

      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-50">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}

      {clients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cliente cadastrado
        </div>
      )}
    </div>
  )
}
