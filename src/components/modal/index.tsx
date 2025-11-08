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
import BackendAlert from "../BackendAlert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

type BudgetModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BudgetModal({ open, onOpenChange }: BudgetModalProps) {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([])
  const [selectedCar, setSelectedCar] = useState<string>("")
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
  const [alert, setAlert] = useState<{ status: "success" | "error"; message: string } | null>(null)

  const { data: drivers, isLoading: isDriversLoading } = useDriver()
  const { data: cars } = useCar()
  const { data: clients } = useClient()
  const { mutate: createBudget, isPending } = useCreateBudget()

  const [driversOpen, setDriversOpen] = useState(false)
  const driversRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (driversRef.current && !driversRef.current.contains(event.target as Node)) {
        setDriversOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setNumMotoristas(selectedDrivers.length || 1)
  }, [selectedDrivers])

  const resetForm = () => {
    setSelectedDrivers([])
    setSelectedCar("")
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
  }

  const handleSubmit = () => {
    if (!selectedClient || selectedDrivers.length === 0 || !selectedCar || !origem || !destino || !dataPartida) {
      setAlert({ status: "error", message: "Preencha todos os campos obrigatórios antes de continuar." })
      return
    }

    createBudget(
      {
        origem,
        destino,
        data_hora_viagem: dataPartida,
        data_hora_viagem_retorno: dataRetorno || "",
        pedagio,
        lucroDesejado,
        impostoPercent,
        custoExtra,
        numMotoristas,
        driver_id: selectedDrivers,
        car_id: selectedCar,
        cliente_id: selectedClient,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          resetForm()
          setAlert({ status: "success", message: "Orçamento cadastrado com sucesso" })
        },
        onError: (err: any) => {
          const backendMessage = err?.response?.data?.message || err?.message || "Falha ao cadastrar orçamento"
          setAlert({ status: "error", message: backendMessage })
        },
      }
    )
  }

  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  const renderSelectedDrivers = () => {
    if (selectedDrivers.length === 0) return "Selecione motoristas"
    return drivers
      ?.filter((d: any) => selectedDrivers.includes(d.id))
      .map((d: any) => d.name)
      .join(", ")
  }

  const handleDriverChange = (driverId: string, checked: boolean) => {
    setSelectedDrivers(prev =>
      checked ? [...prev, driverId] : prev.filter(id => id !== driverId)
    )
  }

  const renderDriverList = () => {
    if (isDriversLoading) return <p>Carregando...</p>
    return drivers?.map((d: any) => (
      <label key={d.id} className="flex items-center space-x-2 py-1">
        <input
          type="checkbox"
          checked={selectedDrivers.includes(d.id)}
          onChange={e => handleDriverChange(d.id, e.target.checked)}
        />
        <span>{d.name}</span>
      </label>
    ))
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Cadastrar Orçamento</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2 relative" ref={driversRef}>
              <Label>Motoristas</Label>

              <Button
                variant="outline"
                onClick={() => setDriversOpen(!driversOpen)}
                className="text-left truncate max-w-full"
              >
                {renderSelectedDrivers()}
              </Button>

              {driversOpen && (
                <div className="absolute z-50 border rounded p-2 max-h-40 overflow-y-auto mt-1 w-full bg-white shadow-md">
                  {renderDriverList()}
                </div>
              )}
            </div>


            <div className="grid gap-2">
              <Label>Carro</Label>
              <select className="border rounded-md p-2" value={selectedCar} onChange={e => setSelectedCar(e.target.value)}>
                <option value="">Selecione o carro</option>
                {cars?.map((c: any) => (<option key={c.id} value={c.id}>{c.model}</option>))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Cliente</Label>
            <select className="border rounded-md p-2" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">Selecione o cliente</option>
              {clients?.map((c: any) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Origem</Label>
              <Input value={origem} onChange={e => setOrigem(e.target.value)} placeholder="Ex: Joinville, SC" />
            </div>
            <div className="grid gap-2">
              <Label>Destino</Label>
              <Input value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ex: Curitiba, PR" />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Pedágio</Label>
              <Input type="number" value={pedagio} onChange={e => setPedagio(Number(e.target.value))} step={0.01} />
            </div>
            <div className="grid gap-2">
              <Label>Imposto (%)</Label>
              <Input type="number" value={impostoPercent} onChange={e => setImpostoPercent(Number(e.target.value))} step={0.01} />
            </div>
            <div className="grid gap-2">
              <Label>Lucro Desejado</Label>
              <Input type="number" value={lucroDesejado} onChange={e => setLucroDesejado(Number(e.target.value))} step={0.01} />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <Label>Custo Extra</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Informe qualquer custo adicional da viagem (Ex: Algum abastecimento durante a viagem, alimentação...).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              value={custoExtra}
              onChange={e => setCustoExtra(Number(e.target.value))}
              step={0.01}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => { onOpenChange(false); resetForm() }}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isPending}>{isPending ? "Salvando..." : "Salvar Orçamento"}</Button>
          </div>
        </div>
      </DialogContent>

      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-50">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}
    </Dialog>
  )
}
