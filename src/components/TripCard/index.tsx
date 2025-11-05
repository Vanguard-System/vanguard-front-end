import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Car, User, Calendar, Users, MessageSquare, Bolt } from "lucide-react"
import type { BudgetTrip } from "@/types/trip"
import { Navigate, useNavigate } from "react-router-dom"

interface TripCardProps {
  trip: BudgetTrip
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();


  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Origem e Destino */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Origem:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{trip.origem}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Destino:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{trip.destino}</p>
            </div>
          </div>

          {/* Carro e Motorista */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-600">
                <Car className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Carro:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{trip.car_id}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-sm font-medium">Motorista:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                {trip.driver_id && trip.driver_id.length > 0
                  ? trip.driver_id.join(", ")
                  : "Nenhum motorista"}
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
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                {new Date(trip.data_hora_viagem).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
            <div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Data/Horário Retorno:</span>
              </div>
              <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">
                {new Date(trip.date_hour_return_trip).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
          </div>

          {/* Cliente */}
          <div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-cyan-500" />
              <span className="text-sm font-medium">Cliente:</span>
            </div>
            <p className="text-gray-900 text-sm sm:text-base mt-1 ml-6">{trip.cliente_id}</p>

            {/* Botão WhatsApp logo abaixo do cliente */}
            <div className="mt-8 ml-6">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border text-black hover:bg-green-50 hover:text-blue-600"
                onClick={() => navigate('/Budget')}
              >
                <Bolt className="w-4 h-4" />
                Página de Orçamentos
              </Button>
            </div>
          </div>




        </div>

      </CardContent>
    </Card>
  )
}
