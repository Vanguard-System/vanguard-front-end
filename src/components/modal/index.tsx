"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDriver } from "@/services/hooks/useDriver"
import { useClient } from "@/services/hooks/useClient"
import { useCar } from "@/services/hooks/useCar"
import { useCreateBudget } from "@/services/hooks/useBudget"

type BudgetModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BudgetModal({ open, onOpenChange }: BudgetModalProps) {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([])
  const [selectedCars, setSelectedCars] = useState<string[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")

  const [origem, setOrigem] = useState("")
  const [destino, setDestino] = useState("")
  const [dataPartida, setDataPartida] = useState("")
  const [dataRetorno, setDataRetorno] = useState("")
  const [pedagio, setPedagio] = useState<number>(0)
  const [lucroDesejado, setLucroDesejado] = useState<number>(0)
  const [impostoPercent, setImpostoPercent] = useState<number>(0)
  const [custoExtra, setCustoExtra] = useState<number>(0)
  const [numMotoristas, setNumMotoristas] = useState<number>(1)

  const { data: drivers, isLoading: isDriversLoading } = useDriver()
  const { data: cars, isLoading: isCarLoading } = useCar()
  const { data: clients, isLoading: isClientLoading } = useClient()
  const { mutate: createBudget, isPending, isSuccess, isError } = useCreateBudget()

  const [driversOpen, setDriversOpen] = useState(false)
  const [carsOpen, setCarsOpen] = useState(false)

  const driversRef = useRef<HTMLDivElement>(null)
  const carsRef = useRef<HTMLDivElement>(null)

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (driversRef.current && !driversRef.current.contains(event.target as Node)) {
        setDriversOpen(false)
      }
      if (carsRef.current && !carsRef.current.contains(event.target as Node)) {
        setCarsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Atualiza o número de motoristas automaticamente
  useEffect(() => {
    setNumMotoristas(selectedDrivers.length || 1)
  }, [selectedDrivers])

  const handleSubmit = () => {
    if (!selectedClient || selectedDrivers.length === 0 || selectedCars.length === 0) {
      alert("Selecione motorista(s), carro(s) e cliente antes de salvar.")
      return
    }

    const payload = {
      origem,
      destino,
      data_hora_viagem: dataPartida,
      data_hora_viagem_retorno: dataRetorno,
      pedagio,
      lucroDesejado,
      impostoPercent,
      numMotoristas,
      custoExtra,
      driver_id: selectedDrivers[0],
      car_id: selectedCars[0],
      cliente_id: selectedClient,
    }

    createBudget(payload, {
      onSuccess: () => {
        // Fecha o modal
        onOpenChange(false)

        // Limpa os campos
        setSelectedDrivers([])
        setSelectedCars([])
        setSelectedClient("")
        setOrigem("")
        setDestino("")
        setDataPartida("")
        setDataRetorno("")
        setPedagio(0)
        setLucroDesejado(0)
        setImpostoPercent(0)
        setCustoExtra(0)
        setNumMotoristas(1)
      },
      onError: (err) => console.error(err),
    })
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Cadastrar Orçamento
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">

          {/* Motoristas e Carros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Motoristas */}
            <div className="grid gap-2 relative" ref={driversRef}>
              <Label>Motoristas</Label>
              <Button
                variant="outline"
                onClick={() => setDriversOpen(!driversOpen)}
                className="text-left truncate max-w-full"
              >
                {selectedDrivers.length > 0
                  ? drivers
                    ?.filter(d => selectedDrivers.includes(d.id))
                    .map(d => d.name)
                    .join(", ")
                  : "Selecione motoristas"}
              </Button>
              {driversOpen && (
                <div className="absolute z-50 border rounded p-2 max-h-40 overflow-y-auto mt-1 w-full bg-white shadow-md">
                  {isDriversLoading ? (
                    <p>Carregando...</p>
                  ) : (
                    drivers?.map((driver: any) => (
                      <label key={driver.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedDrivers.includes(driver.id)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setSelectedDrivers(prev =>
                              checked
                                ? [...prev, driver.id]
                                : prev.filter(id => id !== driver.id)
                            )
                          }}
                        />
                        <span>{driver.name}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Carros */}
            <div className="grid gap-2 relative" ref={carsRef}>
              <Label>Carros</Label>
              <Button
                variant="outline"
                onClick={() => setCarsOpen(!carsOpen)}
                className="text-left truncate max-w-full"
              >
                {selectedCars.length > 0
                  ? cars
                    ?.filter(c => selectedCars.includes(c.id))
                    .map(c => `${c.model} (${c.plate})`)
                    .join(", ")
                  : "Selecione carros"}
              </Button>
              {carsOpen && (
                <div className="absolute z-50 border rounded p-2 max-h-40 overflow-y-auto mt-1 w-full bg-white shadow-md">
                  {isCarLoading ? (
                    <p>Carregando...</p>
                  ) : (
                    cars?.map((car: any) => (
                      <label key={car.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedCars.includes(car.id)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setSelectedCars(prev =>
                              checked
                                ? [...prev, car.id]
                                : prev.filter(id => id !== car.id)
                            )
                          }}
                        />
                        <span>{car.model} ({car.plate})</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cliente */}
          <div className="grid gap-2">
            <Label>Cliente</Label>
            <select
              className="border rounded-md p-2"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Selecione o cliente</option>
              {clients?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Origem e Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Origem</Label>
              <Input
                value={origem}
                onChange={e => setOrigem(e.target.value)}
                placeholder="Endereço de origem"
              />
            </div>
            <div className="grid gap-2">
              <Label>Destino</Label>
              <Input
                value={destino}
                onChange={e => setDestino(e.target.value)}
                placeholder="Endereço de destino"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data e Hora Partida</Label>
              <Input type="datetime-local" value={dataPartida} onChange={e => setDataPartida(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Data e Hora Retorno</Label>
              <Input type="datetime-local" value={dataRetorno} onChange={e => setDataRetorno(e.target.value)} />
            </div>
          </div>

          {/* Pedágio e Imposto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Pedágio</Label>
              <Input type="number" value={pedagio} onChange={e => setPedagio(Number(e.target.value))} step={0.01} />
            </div>
            <div className="grid gap-2 relative">
              <Label>Imposto (%)</Label>
              <Input type="number" value={impostoPercent} onChange={e => setImpostoPercent(Number(e.target.value))} step={0.01} />
            </div>
          </div>

          {/* Lucro, Custo Extra e Nº Motoristas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Lucro Desejado</Label>
              <Input type="number" value={lucroDesejado} onChange={e => setLucroDesejado(Number(e.target.value))} step={0.01} />
            </div>
            <div className="grid gap-2">
              <Label>Custo Extra</Label>
              <Input type="number" value={custoExtra} onChange={e => setCustoExtra(Number(e.target.value))} step={0.01} />
            </div>
            <div className="grid gap-2">
              <Label>Nº Motoristas</Label>
              <Input type="number" readOnly value={numMotoristas} className="bg-gray-100 cursor-not-allowed" />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isPending}>{isPending ? "Salvando..." : "Salvar Orçamento"}</Button>
          </div>

          {/* Feedback */}
          {isSuccess && <p className="text-green-600 text-center">✅ Orçamento criado com sucesso!</p>}
          {isError && <p className="text-red-600 text-center">❌ Erro ao criar orçamento.</p>}

        </div>
      </DialogContent>
    </Dialog>
  )
}
