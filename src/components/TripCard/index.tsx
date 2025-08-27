import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Car, User, Clock, Calendar, DollarSign, Users } from "lucide-react"

interface Viagem {
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

interface ViagemCardProps {
  viagem: Viagem
}

export default function TripCard({ viagem }: ViagemCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">#{viagem.id}</span>
            <Badge className={getStatusColor(viagem.status)}>{viagem.status}</Badge>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center text-green-600 font-bold text-xl">
              <DollarSign className="w-5 h-5 mr-1" />
              {viagem.preco}
            </div>
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
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.origem}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Destino:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.destino}</p>
            </div>
          </div>

          {/* Carro e Motorista */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Car className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Carro:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.carro}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-sm font-medium">Motorista:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.motorista}</p>
            </div>
          </div>

          {/* Cliente */}
          <div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-cyan-500" />
              <span className="text-sm font-medium">Cliente:</span>
            </div>
            <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.cliente}</p>
          </div>

          {/* Data e Hora */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Data:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.dia}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="text-sm font-medium">Horário:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{viagem.hora}</p>
            </div>
          </div>
        </div>

        {/* Botão Cancelar */}
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-red-600 hover:text-red-700 bg-transparent"
          >
            Cancelar Viagem
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
