"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  User,
  Mail,
  CreditCard,
  Edit,
  Trash2,
  FileText,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDriver, useUpdateDriver, useDeleteDriver } from "@/services/hooks/useDriver"
import BackendAlert from "@/components/BackendAlert"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import RemunerationReceipt from "../RemunerationReceipt"
import { getDriverRemuneration } from "@/services/driver"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog"
import { DialogFooter, DialogHeader } from "../ui/dialog"

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

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Driver | null>(null)
  const [alert, setAlert] = useState<{ status: 'success' | 'error'; message: string } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null)

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
      setAlert({ status: "success", message: "Motorista atualizado com sucesso" })
      cancelEdit()
    } catch {
      setAlert({ status: "error", message: "Falha ao atualizar motorista" })
    }
  }

  const handleChange = (field: keyof Driver, value: string | number) => {
    if (!formData) return
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver)
    setDeleteConfirmOpen(true)
  }

  const handleGeneratePayroll = async (driver: Driver) => {
    try {
      const today = new Date()
      const month = today.getMonth() + 1
      const year = today.getFullYear()

      const remunerationData = await getDriverRemuneration(driver.id, month, year)

      if (!remunerationData || !remunerationData.trips) {
        setAlert({ status: "error", message: "Nenhuma remuneração encontrada para este motorista." })
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

      setAlert({ status: "success", message: `Holerite de ${driver.name} (${month}/${year}) gerado com sucesso!` })
    } catch (error) {
      console.error(error)
      setAlert({ status: "error", message: "Falha ao gerar o holerite." })
    }
  }

  const confirmDelete = async () => {
    if (!driverToDelete) return
    try {
      await deleteDriverMutation.mutateAsync(driverToDelete.id)
      setAlert({ status: "success", message: "Motorista deletado com sucesso" })
    } catch {
      setAlert({ status: "error", message: "Falha ao deletar motorista" })
    } finally {
      setDeleteConfirmOpen(false)
      setDriverToDelete(null)
    }
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  return (
    <div className="flex flex-col flex-1 p-4 md:p-6 ml-0 md:ml-64">
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-4 md:mb-6">
        Motoristas Cadastrados
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
                  <CreditCard className="h-4 w-4" /> CPF
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4" /> Custo Motorista
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4" /> Diária Motorista
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrivers.map((driver: any) => {
              const isEditing = editingId === driver.id
              return (
                <TableRow key={driver.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input value={formData?.name || ""} onChange={(e) => handleChange("name", e.target.value)} className="h-8" />
                    ) : driver.name}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input value={formData?.cpf || ""} onChange={(e) => handleChange("cpf", e.target.value)} className="h-8" />
                    ) : driver.cpf}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input value={formData?.email || ""} onChange={(e) => handleChange("email", e.target.value)} className="h-8" />
                    ) : driver.email}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input type="number" value={formData?.driverCost ?? 0} onChange={(e) => handleChange("driverCost", Number(e.target.value))} className="h-8" />
                    ) : driver.driverCost}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input type="number" value={formData?.dailyPriceDriver ?? 0} onChange={(e) => handleChange("dailyPriceDriver", Number(e.target.value))} className="h-8" />
                    ) : driver.dailyPriceDriver}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={saveEdit} className="h-8 px-3 hover:bg-green-50 hover:text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 px-3 hover:bg-gray-50 hover:text-gray-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleGeneratePayroll(driver)} className="h-8 px-3 hover:bg-green-50 hover:text-green-600">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => startEdit(driver)} className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(driver)} className="h-8 px-3 hover:bg-red-50 hover:text-red-600">
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

      {/* Cards Mobile */}
      <div className="md:hidden flex flex-col gap-4 overflow-auto">
        {paginatedDrivers.map((driver: any) => {
          const isEditing = editingId === driver.id
          return (
            <div key={driver.id} className="bg-card border rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><User className="h-4 w-4" /> Nome</div>
                {isEditing ? <Input value={formData?.name || ""} onChange={e => handleChange("name", e.target.value)} className="h-9" /> : <p>{driver.name}</p>}
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
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><CircleDollarSign className="h-4 w-4" /> Custo Motorista</div>
                {isEditing ? <Input type="number" value={formData?.driverCost ?? 0} onChange={e => handleChange("driverCost", Number(e.target.value))} className="h-9" /> : <p>{driver.driverCost}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><CircleDollarSign className="h-4 w-4" /> Diária Motorista</div>
                {isEditing ? <Input type="number" value={formData?.dailyPriceDriver ?? 0} onChange={e => handleChange("dailyPriceDriver", Number(e.target.value))} className="h-9" /> : <p>{driver.dailyPriceDriver}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={saveEdit} className="h-9 px-4 hover:bg-green-50 hover:text-green-600">
                      <Check className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-9 px-4 hover:bg-gray-50 hover:text-gray-600">
                      <X className="h-4 w-4 mr-2" /> Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleGeneratePayroll(driver)} className="h-9 px-4 hover:bg-green-50 hover:text-green-600">
                      <FileText className="h-4 w-4 mr-2" /> Holerite
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(driver)} className="h-9 px-4 hover:bg-blue-50 hover:text-blue-600">
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(driver)} className="h-9 px-4 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Paginação Centralizada */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{currentPage}/{totalPages}</span>
          <Button variant="ghost" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog de confirmação */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed inset-0 flex items-center justify-center z-[1000] px-4">
            <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 relative">
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600 mt-2">
                Tem certeza que deseja excluir o motorista{" "}
                <strong>{driverToDelete?.name}</strong>?
              </p>
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="w-24">
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDelete} className="w-24">
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </div>
        </DialogPortal>
      </Dialog>

      {/* Alertas fixos */}
      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-50">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}
    </div>
  )
}
