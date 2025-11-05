export interface Orcamento {
  id: string
  origem: string
  destino: string
  data_hora_viagem: string
  date_hour_return_trip: string
  cliente_id: string
  driver_id: string[]
  car_id: string
  distancia_total: number
  preco_viagem: number
  lucroDesejado: number
  status: string
}