import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Car, User, Clock, Calendar, DollarSign, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Orcamento {
  id: number
  preco: string
  origem: string
  destino: string
  carro: string
  motorista: string
  cliente: string
  dia: string
  hora: string
  status: string
}

interface OrcamentoCardProps {
  orcamentos: Orcamento
  lucroPercent?: number // percentual de lucro opcional, padrão 20%
}

export default function BudgetCard({ orcamentos, lucroPercent = 20 }: OrcamentoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(orcamentos)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleChange = (field: keyof Orcamento, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Salvando:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(orcamentos)
    setIsEditing(false)
  }

  // Calcula lucro baseado no valor do orçamento
  const calcularLucro = () => {
    const precoNum = parseFloat(formData.preco.replace(",", "."))
    if (isNaN(precoNum)) return "0,00"
    const lucro = precoNum * (lucroPercent / 100)
    return lucro.toFixed(2).replace(".", ",")
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">#{formData.id}</span>
            <Badge className={getStatusColor(formData.status)}>{formData.status}</Badge>
          </div>
        </div>

        {/* Conteúdo */}
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
                  onChange={e => handleChange("origem", e.target.value)}
                  className="ml-6"
                />
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
                <Input
                  value={formData.destino}
                  onChange={e => handleChange("destino", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.destino}</p>
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
                <Input
                  value={formData.carro}
                  onChange={e => handleChange("carro", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.carro}</p>
              )}
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-sm font-medium">Motorista:</span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.motorista}
                  onChange={e => handleChange("motorista", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.motorista}</p>
              )}
            </div>
          </div>

          {/* Cliente */}
          <div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-cyan-500" />
              <span className="text-sm font-medium">Cliente:</span>
            </div>
            {isEditing ? (
              <Input
                value={formData.cliente}
                onChange={e => handleChange("cliente", e.target.value)}
                className="ml-6"
              />
            ) : (
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.cliente}</p>
            )}
          </div>

          {/* Data e Hora */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Data:</span>
              </div>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.dia}
                  onChange={e => handleChange("dia", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.dia}</p>
              )}
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="text-sm font-medium">Horário:</span>
              </div>
              {isEditing ? (
                <Input
                  type="time"
                  value={formData.hora}
                  onChange={e => handleChange("hora", e.target.value)}
                  className="ml-6"
                />
              ) : (
                <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{formData.hora}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t border-gray-200">
          {/* Div da esquerda - Preço + Lucro */}
          <div className="flex items-center space-x-10">
            <div className="flex items-center text-green-600 font-bold text-xl">
              <DollarSign className="w-5 h-5 mr-1" />
              {isEditing ? (
                <Input
                  value={formData.preco}
                  onChange={e => handleChange("preco", e.target.value)}
                  className="w-24"
                />
              ) : (
                formData.preco
              )}
            </div>
            <div className="flex items-center text-blue-600 font-medium">
              <span className="mr-1">Lucro:</span>
              {calcularLucro()}
            </div>
          </div>

          {/* Div da direita - Botões */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" className="w-full sm:w-auto" onClick={handleSave}>
                  Salvar
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-red-600 hover:text-red-700 bg-transparent"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>

  
      </CardContent>
    </Card>
  )
}
