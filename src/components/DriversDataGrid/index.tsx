"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Mail, CreditCard, Edit, Trash2, FileText, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useDriver, useUpdateDriver, useDeleteDriver } from "@/services/hooks/useDriver"

// libs para gerar pdf
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import RemunerationReceipt from "../RemunerationReceipt"

interface Driver {
  id: string
  name: string
  cpf: string
  email: string
  paymentType: string
}

const getPaymentTypeLabel = (type: string) => {
  switch (type) {
    case "Mensal": return "Mensal"
    case "Por Viagem": return "Por Viagem"
    default: return type
  }
}

const getPaymentTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "Mensal": return "default"
    case "Por Viagem": return "secondary"
    default: return "outline"
  }
}

export function DriverDataGrid() {
  const { data: drivers = [] } = useDriver()
  const updateDriverMutation = useUpdateDriver()
  const deleteDriverMutation = useDeleteDriver()
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Driver | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(drivers.length / itemsPerPage)
  const paginatedDrivers = drivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const startEdit = (driver: Driver) => {
    setEditingId(driver.id)
    setFormData({ ...driver })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData(null)
  }

  const saveEdit = async () => {
    if (!formData) return
    try {
      await updateDriverMutation.mutateAsync({ id: formData.id, data: formData })
      toast({ title: "Sucesso", description: "Motorista atualizado com sucesso" })
      cancelEdit()
    } catch {
      toast({ title: "Erro", description: "Falha ao atualizar motorista", variant: "destructive" })
    }
  }

  const handleChange = (field: keyof Driver, value: string) => {
    if (!formData) return
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDriverMutation.mutateAsync(id)
      toast({ title: "Sucesso", description: "Motorista deletado com sucesso" })
    } catch {
      toast({ title: "Erro", description: "Falha ao deletar motorista", variant: "destructive" })
    }
  }

  const handleGeneratePayroll = async (driver: Driver) => {
    const dados = {
      funcionario: driver.name,
      mes: "08",
      ano: "2025",
      viagens: { quantidade: 10, valor: 150 },
      alimentacao: 500,
      extras: 200,
    }

    const blob = await pdf(<RemunerationReceipt dados={dados} />).toBlob()
    saveAs(blob, `holerite-${driver.name}-${dados.mes}-${dados.ano}.pdf`)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col flex-1 p-4 md:p-6 ml-0 md:ml-64">
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6">Motoristas Cadastrados</h2>

      {/* Tabela Desktop */}
      <div className="hidden md:flex flex-1 overflow-auto rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]"><div className="flex items-center gap-2"><User className="h-4 w-4" /> Nome</div></TableHead>
              <TableHead><div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> CPF</div></TableHead>
              <TableHead><div className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</div></TableHead>
              <TableHead>Tipo de Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrivers.map((driver: Driver) => {
              const isEditing = editingId === driver.id
              return (
                <TableRow key={driver.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input value={formData?.name || ""} onChange={e => handleChange("name", e.target.value)} className="h-8" />
                    ) : driver.name}
                  </TableCell>
                  <TableCell>{isEditing ? <Input value={formData?.cpf || ""} onChange={e => handleChange("cpf", e.target.value)} className="h-8" /> : driver.cpf}</TableCell>
                  <TableCell>{isEditing ? <Input value={formData?.email || ""} onChange={e => handleChange("email", e.target.value)} className="h-8" /> : driver.email}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Select value={formData?.paymentType || ""} onValueChange={value => handleChange("paymentType", value)}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Tipo de Pagamento" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                          <SelectItem value="Por Viagem">Por Viagem</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getPaymentTypeBadgeVariant(driver.paymentType)}>{getPaymentTypeLabel(driver.paymentType)}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={saveEdit} className="h-8 px-3 hover:bg-green-50 hover:text-green-600"><Check className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 px-3 hover:bg-gray-50 hover:text-gray-600"><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleGeneratePayroll(driver)} className="h-8 px-3 hover:bg-green-50 hover:text-green-600"><FileText className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => startEdit(driver)} className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(driver.id)} className="h-8 px-3 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
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

      {/* Paginação Desktop */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-end items-center gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      {/* Cards Mobile */}
      <div className="md:hidden flex flex-col gap-4 overflow-auto">
        {paginatedDrivers.map((driver: Driver) => {
          const isEditing = editingId === driver.id
          return (
            <div key={driver.id} className="bg-card border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><User className="h-4 w-4" /> Nome</div>
                {isEditing ? <Input value={formData?.name || ""} onChange={e => handleChange("name", e.target.value)} className="h-9" /> : <p className="font-medium">{driver.name}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><CreditCard className="h-4 w-4" /> CPF</div>
                {isEditing ? <Input value={formData?.cpf || ""} onChange={e => handleChange("cpf", e.target.value)} className="h-9" /> : <p>{driver.cpf}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Mail className="h-4 w-4" /> Email</div>
                {isEditing ? <Input value={formData?.email || ""} onChange={e => handleChange("email", e.target.value)} className="h-9" /> : <p className="break-all">{driver.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Tipo de Pagamento</div>
                {isEditing ? (
                  <Select value={formData?.paymentType || ""} onValueChange={value => handleChange("paymentType", value)}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Tipo de Pagamento" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mensal">Mensal</SelectItem>
                      <SelectItem value="Por Viagem">Por Viagem</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={getPaymentTypeBadgeVariant(driver.paymentType)}>{getPaymentTypeLabel(driver.paymentType)}</Badge>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={saveEdit} className="h-9 px-4 hover:bg-green-50 hover:text-green-600"><Check className="h-4 w-4 mr-2" /> Salvar</Button>
                    <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-9 px-4 hover:bg-gray-50 hover:text-gray-600"><X className="h-4 w-4 mr-2" /> Cancelar</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleGeneratePayroll(driver)} className="h-9 px-4 hover:bg-green-50 hover:text-green-600"><FileText className="h-4 w-4 mr-2" /> Holerite</Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(driver)} className="h-9 px-4 hover:bg-blue-50 hover:text-blue-600"><Edit className="h-4 w-4 mr-2" /> Editar</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(driver.id)} className="h-9 px-4 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Excluir</Button>
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Paginação Mobile */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <span>{currentPage}/{totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>

      {drivers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Nenhum motorista cadastrado</div>
      )}
    </div>
  )
}
