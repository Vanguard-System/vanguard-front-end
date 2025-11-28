import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Car,
  User,
  Calendar,
  DollarSign,
  Users,
  FileText,
  MessageSquare,
  Compass,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import BudgetReceipt from "@/components/BudgetReceipt"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import type { Orcamento } from "@/types/orcamento"
import { useCar } from "@/services/hooks/useCar"
import { useDriver } from "@/services/hooks/useDriver"
import { useClient } from "@/services/hooks/useClient"
import { useQueryClient } from "@tanstack/react-query"
import { useUpdateBudgetStatus } from "@/services/hooks/useBudget"
import BackendAlert from "../BackendAlert"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog"
import { DialogFooter, DialogHeader } from "../ui/dialog"

interface BudgetCardProps {
  orcamento: Orcamento
  updateBudget: any
  deleteBudget: any
}

export default function BudgetCard({
  orcamento,
  updateBudget,
  deleteBudget,
}: BudgetCardProps) {
  const queryClient = useQueryClient()
  const { data: cars } = useCar()
  const { data: drivers } = useDriver()
  const { data: clients } = useClient()
  const updateBudgetStatus = useUpdateBudgetStatus()

  const formatForInput = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [alert, setAlert] = useState<{ status: "success" | "error"; message: string } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<Orcamento | null>(null)

  const [formData, setFormData] = useState({
    id: orcamento.id,
    origem: orcamento.origem,
    destino: orcamento.destino,
    carro: String(orcamento.car_id || ""),
    motoristas: orcamento.driver_id || [], 
    cliente: String(orcamento.cliente_id || ""),
    data_hora_viagem: formatForInput(orcamento.data_hora_viagem),
    data_hora_viagem_retorno: formatForInput(orcamento.data_hora_viagem_retorno),
    preco_viagem: orcamento.preco_viagem,
    lucroDesejado: orcamento.lucroDesejado,
    status: orcamento.status,
    distancia_total: orcamento.distancia_total,
    pedagio: orcamento.pedagio,
    impostoPercent: orcamento.impostoPercent,
    custoExtra: orcamento.custoExtra
  })

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      if (!formData.carro || !formData.motoristas.length || !formData.cliente) {
        setAlert({ status: "error", message: "Selecione carro, motorista(s) e cliente antes de salvar." })
        return
      }

      // Criar o payload base
      const payload: any = {
        origem: formData.origem,
        destino: formData.destino,
        car_id: formData.carro,
        driver_id: formData.motoristas, // <-- corrigido (antes era driver_ids)
        cliente_id: formData.cliente,
        data_hora_viagem: formData.data_hora_viagem,
        data_hora_viagem_retorno: formData.data_hora_viagem_retorno,
        lucroDesejado: formData.lucroDesejado,
        status: formData.status,
        pedagio: formData.pedagio,
        impostoPercent: formData.impostoPercent,
        custoExtra: formData.custoExtra,
        numMotoristas: formData.motoristas.length,

      }

      // 👉 Só manda preco_viagem SE o usuário editou
      if (formData.preco_viagem !== orcamento.preco_viagem) {
        payload.preco_viagem = formData.preco_viagem
      }

      await updateBudget.mutateAsync({ id: formData.id, data: payload })
      await queryClient.invalidateQueries({ queryKey: ["budget"] })

      setIsEditing(false)
      setIsEditingStatus(false)
      setAlert({ status: "success", message: "Orçamento atualizado com sucesso!" })
    } catch (err: any) {
      console.error("Erro ao salvar orçamento:", err)
      setAlert({ status: "error", message: err?.response?.data?.message || "Erro ao salvar o orçamento." })
    }
  }

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        id: orcamento.id,
        origem: orcamento.origem,
        destino: orcamento.destino,
        carro: String(orcamento.car_id || ""),
        motoristas: orcamento.driver_id || [],
        cliente: String(orcamento.cliente_id || ""),
        data_hora_viagem: formatForInput(orcamento.data_hora_viagem),
        data_hora_viagem_retorno: formatForInput(orcamento.data_hora_viagem_retorno),
        preco_viagem: Number(orcamento.preco_viagem) || 0,
        lucroDesejado: Number(orcamento.lucroDesejado) || 0,
        status: orcamento.status,
        distancia_total: orcamento.distancia_total || 0,
        pedagio: orcamento.pedagio,
        impostoPercent: orcamento.impostoPercent,
        custoExtra: orcamento.custoExtra
      })
    }
  }, [orcamento, isEditing])


  const handleDeleteClick = (budget: Orcamento) => {
    setBudgetToDelete(budget)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!budgetToDelete) return
    try {
      await deleteBudget.mutateAsync(budgetToDelete.id)
      setDeleteConfirmOpen(false)
      setAlert({ status: "success", message: "Orçamento deletado com sucesso" })
    } catch {
      setDeleteConfirmOpen(false)
      setAlert({ status: "error", message: "Falha ao deletar orçamento" })
    } finally {
      setBudgetToDelete(null)
    }
  }

  const findName = (list: any[], id: string, fallback: string) => {
    return list?.find((item) => String(item.id) === id)?.name || fallback
  }

  const findCar = (list: any[], id: string, fallback: string) => {
    const car = list?.find((item) => String(item.id) === id)
    return car ? `${car.model} (${car.plate})` : fallback
  }

  return (
    <Card className="hover:shadow-md transition-shadow relative">
      {/* Status */}
      <div className="absolute top-3 right-3">
        {isEditingStatus ? (
          <select
            value={formData.status}
            onChange={async (e) => {
              const newStatus = e.target.value
              handleChange("status", newStatus)
              try {
                await updateBudgetStatus.mutateAsync({ id: formData.id, status: newStatus })
                await queryClient.invalidateQueries({ queryKey: ["budget"] })
                setIsEditingStatus(false)
              } catch {
                setAlert({ status: "error", message: "Falha ao atualizar status!" })
              }
            }}
            className="border text-sm rounded-md p-1 bg-white"
            autoFocus
            onBlur={() => setIsEditingStatus(false)}
          >
            <option value="Pendente">🟡 Pendente</option>
            <option value="Aprovada">🟢 Aprovada</option>
          </select>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingStatus(true)}
            className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full transition ${formData.status === "Aprovada"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-yellow-100 text-yellow-700 border border-yellow-300"
              }`}
          >
            {formData.status === "Aprovada" ? (
              <>
                <CheckCircle className="w-4 h-4" /> Aprovado
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" /> Pendente
              </>
            )}
          </button>
        )}
      </div>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Origem e Destino */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Origem:</span>
              </div>
              {isEditing ? (
                <Input value={formData.origem} onChange={(e) => handleChange("origem", e.target.value)} className="ml-6" />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.origem}</p>
              )}
            </div>

            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Destino:</span>
              </div>
              {isEditing ? (
                <Input value={formData.destino} onChange={(e) => handleChange("destino", e.target.value)} className="ml-6" />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.destino}</p>
              )}
            </div>
          </div>

          {/* Carro e Motoristas */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Car className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Carro:</span>
              </div>
              {isEditing ? (
                <select
                  className="ml-6 border rounded-md p-2 text-sm w-full"
                  value={formData.carro}
                  onChange={(e) => handleChange("carro", e.target.value)}
                >
                  <option value="">Selecione o carro</option>
                  {cars?.map((c: any) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.model} ({c.plate})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {findCar(cars || [], formData.carro, formData.carro)}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-sm font-medium">Motorista(s):</span>
              </div>
              {isEditing ? (
                <select
                  multiple
                  className="ml-6 border rounded-md p-2 text-sm w-full"
                  value={formData.motoristas}
                  onChange={(e) =>
                    handleChange(
                      "motoristas",
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                >
                  {drivers?.map((d: any) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {formData.motoristas.map((id: string) => findName(drivers || [], id, id)).join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Cliente e Distância */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2 text-cyan-500" />
                <span className="text-sm font-medium">Cliente:</span>
              </div>
              {isEditing ? (
                <select
                  className="ml-6 border rounded-md p-2 text-sm w-full"
                  value={formData.cliente}
                  onChange={(e) => handleChange("cliente", e.target.value)}
                >
                  <option value="">Selecione o cliente</option>
                  {clients?.map((c: any) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {findName(clients || [], formData.cliente, formData.cliente)}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center text-gray-600">
                <Compass className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Distância Total:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.distancia_total} km</p>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Data/Horário Ida:</span>
              </div>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={formData.data_hora_viagem}
                  onChange={(e) => handleChange("data_hora_viagem", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {new Date(formData.data_hora_viagem).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Data/Horário Retorno:</span>
              </div>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={formData.data_hora_viagem_retorno}
                  onChange={(e) => handleChange("data_hora_viagem_retorno", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {new Date(formData.data_hora_viagem_retorno).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-6 mt-6 ml-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Pedágio:</label>
              <Input
                type="number"
                value={formData.pedagio}
                onChange={(e) => handleChange("pedagio", parseFloat(e.target.value))}
                className="w-32"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Imposto (%):</label>
              <Input
                type="number"
                value={formData.impostoPercent}
                onChange={(e) => handleChange("impostoPercent", parseFloat(e.target.value))}
                className="w-32"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Custo Extra:</label>
              <Input
                type="number"
                value={formData.custoExtra}
                onChange={(e) => handleChange("custoExtra", parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-10">

            <div className="flex items-center text-green-600 font-bold text-xl">
              <DollarSign className="w-5 h-5 mr-1" />
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.preco_viagem}
                  onChange={(e) => handleChange("preco_viagem", parseFloat(e.target.value))}
                  className="w-36"
                />
              ) : (
                formData.preco_viagem.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              )}
            </div>

            <div className="flex items-center text-blue-600 font-medium">
              <span className="mr-1">Lucro:</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.lucroDesejado}
                  onChange={(e) => handleChange("lucroDesejado", parseFloat(e.target.value))}
                  className="w-32"
                />
              ) : (
                formData.lucroDesejado.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border text-black hover:bg-green-50 hover:text-green-600"
              onClick={async () => {
                const blob = await pdf(<BudgetReceipt dados={formData} />).toBlob()
                const viagemDate = new Date(formData.data_hora_viagem).toLocaleDateString("pt-BR")
                saveAs(blob, `ticket-${formData.cliente}-${viagemDate}.pdf`)
              }}
            >
              <FileText className="w-4 h-4" /> Comprovante de viagem
            </Button>

            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border text-black hover:bg-green-50 hover:text-green-600"
                  onClick={handleSave}
                >
                  Salvar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteClick(orcamento)}
                >
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-[999]" />
          <div className="fixed inset-0 flex items-center justify-center z-[1000] px-4">
            <DialogContent className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 relative">
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600 mt-2">
                Tem certeza que deseja excluir este orçamento?
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

      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-[2000]">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}
    </Card>
  )
}
