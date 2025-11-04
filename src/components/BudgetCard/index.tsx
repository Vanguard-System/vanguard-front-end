import { useState } from "react"
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
  const [formData, setFormData] = useState({
    id: orcamento.id,
    origem: orcamento.origem,
    destino: orcamento.destino,
    carro: String(orcamento.car_id || ""),
    motorista: String(orcamento.driver_id || ""),
    cliente: String(orcamento.cliente_id || ""),
    data_hora_viagem: formatForInput(orcamento.data_hora_viagem),
    date_hour_return_trip: formatForInput(orcamento.date_hour_return_trip),
    preco_viagem: orcamento.preco_viagem,
    lucro: orcamento.lucro,
    status: orcamento.status, // pega diretamente do backend
    distancia_total: orcamento.distancia_total,
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      if (!formData.carro || !formData.motorista || !formData.cliente) {
        alert("Selecione carro, motorista e cliente antes de salvar.")
        return
      }

      const payload = {
        origem: formData.origem,
        destino: formData.destino,
        car_id: formData.carro,
        driver_id: formData.motorista,
        cliente_id: formData.cliente,
        data_hora_viagem: formData.data_hora_viagem,
        date_hour_return_trip: formData.date_hour_return_trip,
        status: formData.status, // envia exatamente como está
      }

      await updateBudget.mutateAsync({ id: formData.id, data: payload })
      await queryClient.invalidateQueries({ queryKey: ["budget"] })
      setIsEditing(false)
      setIsEditingStatus(false)
    } catch (err) {
      console.error("Erro ao salvar orçamento:", err)
      alert("Erro ao salvar o orçamento. Veja o console para mais detalhes.")
    }
  }

  const handleDelete = () => {
    if (confirm("Deseja realmente deletar este orçamento?")) {
      deleteBudget.mutate(orcamento.id)
    }
  }

  const gerarLinkWhatsApp = (orcamento: any) => {
    const mensagem = `Olá ${findName(clients || [], orcamento.cliente, "Cliente")}, aqui está seu orçamento:
Origem: ${orcamento.origem}
Destino: ${orcamento.destino}
Carro: ${orcamento.carro}
Motorista: ${orcamento.motorista}
Data/Hora: ${orcamento.data_hora_viagem}
Preço: R$ ${orcamento.preco_viagem}`

    const clienteObj = clients?.find((c: any) => String(c.id) === orcamento.cliente)
    const numero = clienteObj?.phone || "55DDNNNNNNNN" 

    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
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
      {/* Label de Status */}
      <div className="absolute top-3 right-3">
        {isEditingStatus ? (
          <select
            value={formData.status}
            onChange={async (e) => {
              const newStatus = e.target.value
              handleChange("status", newStatus)

              try {
                await updateBudgetStatus.mutateAsync({
                  id: formData.id,
                  status: newStatus,
                })

                await queryClient.invalidateQueries({ queryKey: ["budget"] })
                setIsEditingStatus(false)
              } catch (err) {
                console.error("Erro ao atualizar status:", err)
                alert("Não foi possível atualizar o status. Tente novamente.")
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
                <Input
                  value={formData.origem}
                  onChange={(e) => handleChange("origem", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {formData.origem}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Destino:</span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.destino}
                  onChange={(e) => handleChange("destino", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {formData.destino}
                </p>
              )}
            </div>
          </div>

          {/* Carro e Motorista */}
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
                <span className="text-sm font-medium">Motorista:</span>
              </div>
              {isEditing ? (
                <select
                  className="ml-6 border rounded-md p-2 text-sm w-full"
                  value={formData.motorista}
                  onChange={(e) => handleChange("motorista", e.target.value)}
                >
                  <option value="">Selecione o motorista</option>
                  {drivers?.map((d: any) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {findName(drivers || [], formData.motorista, formData.motorista)}
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
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                {formData.distancia_total} km
              </p>
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
                  onChange={(e) =>
                    handleChange("data_hora_viagem", e.target.value)
                  }
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {new Date(formData.data_hora_viagem).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">
                  Data/Horário Retorno:
                </span>
              </div>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={formData.date_hour_return_trip}
                  onChange={(e) =>
                    handleChange("date_hour_return_trip", e.target.value)
                  }
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                  {new Date(
                    formData.date_hour_return_trip
                  ).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-10">
            <div className="flex items-center text-green-600 font-bold text-xl">
              <DollarSign className="w-5 h-5 mr-1" />
              {formData.preco_viagem.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="flex items-center text-blue-600 font-medium">
              <span className="mr-1">Lucro:</span>
              {formData.lucro.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border text-black hover:bg-green-50 hover:text-green-600"
              onClick={() =>
                window.open(gerarLinkWhatsApp(formData), "_blank")
              }
            >
              <MessageSquare className="w-4 h-4 text-green-500" />
              Enviar no WhatsApp
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border text-black hover:bg-green-50 hover:text-green-600"
              onClick={async () => {
                const blob = await pdf(<BudgetReceipt dados={formData} />).toBlob()
                const viagemDate = new Date(
                  formData.data_hora_viagem
                ).toLocaleDateString("pt-BR")
                saveAs(blob, `ticket-${formData.cliente}-${viagemDate}.pdf`)
              }}
            >
              <FileText className="w-4 h-4" />
              Holerite
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
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
