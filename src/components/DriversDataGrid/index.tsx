"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Mail, CreditCard, Edit, Trash2, FileText, Check, X, ChevronLeft, ChevronRight, CircleDollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useDriver, useUpdateDriver, useDeleteDriver, useDriverRemuneration } from "@/services/hooks/useDriver"

// libs para gerar pdf
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import RemunerationReceipt from "../RemunerationReceipt"
import { getDriverRemuneration } from "@/services/driver"

interface Driver {
  id: string
  name: string
  cpf: string
  email: string
  driverCost: number
  dailyPriceDriver: number
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

  const handleChange = (field: keyof Driver, value: string | number) => {
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


  const handleGeneratePayroll = async (driver: any) => {
    try {
      const today = new Date()
      const month = today.getMonth() + 1
      const year = today.getFullYear()

      // 🔹 Busca remuneração real da API
      const remunerationData = await getDriverRemuneration(driver.id, month, year)

      if (!remunerationData || !remunerationData.trips) {
        toast({
          title: "Sem dados",
          description: "Nenhuma remuneração encontrada para este motorista.",
          variant: "destructive",
        })
        return
      }

      const totalTrips = remunerationData.trips.length

      const dados = {
        funcionario: remunerationData.driver,
        mes: remunerationData.month,
        ano: remunerationData.year,
        viagens: {
          quantidade: totalTrips,
          valor: remunerationData.dailyRate,
          totalDays: remunerationData.totalDays,
          totalRemuneration: remunerationData.totalRemuneration,
        },
      }

      const blob = await pdf(<RemunerationReceipt dados={dados} />).toBlob()
      saveAs(blob, `holerite-${driver.name}-${month}-${year}.pdf`)

      toast({
        title: "Sucesso",
        description: `Holerite de ${driver.name} (${month}/${year}) gerado com sucesso!`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Falha ao gerar o holerite.",
        variant: "destructive",
      })
    }
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
              <TableHead><div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4" /> Custo Motorista</div></TableHead>
              <TableHead><div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4" /> Diária Motorista</div></TableHead>
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
                  <TableCell>{isEditing ? <Input type="number" value={formData?.driverCost || 0} onChange={e => handleChange("driverCost", Number(e.target.value))} className="h-8" /> : driver.driverCost}</TableCell>
                  <TableCell>{isEditing ? <Input type="number" value={formData?.dailyPriceDriver || 0} onChange={e => handleChange("dailyPriceDriver", Number(e.target.value))} className="h-8" /> : driver.dailyPriceDriver}</TableCell>
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
