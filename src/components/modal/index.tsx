"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type BudgetModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BudgetModal({ open, onOpenChange }: BudgetModalProps) {
  const handleSubmit = () => {
    console.log("Orçamento salvo!")
    onOpenChange(false)
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
          {/* Motorista e Carro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="driver">Motorista</Label>
              <Select>
                <SelectTrigger id="driver" aria-label="Selecionar Motorista">
                  <SelectValue placeholder="Selecione o motorista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Oliveira</SelectItem>
                  <SelectItem value="pedro">Pedro Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="car">Carro</Label>
              <Select>
                <SelectTrigger id="car" aria-label="Selecionar Carro">
                  <SelectValue placeholder="Selecione o carro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carro-a">Carro A (ABC-1234)</SelectItem>
                  <SelectItem value="carro-b">Carro B (DEF-5678)</SelectItem>
                  <SelectItem value="carro-c">Carro C (GHI-9012)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cliente */}
          <div className="grid gap-2">
            <Label htmlFor="client">Cliente</Label>
            <Select>
              <SelectTrigger id="client" aria-label="Selecionar Cliente">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente-x">Cliente X Ltda.</SelectItem>
                <SelectItem value="cliente-y">Cliente Y S.A.</SelectItem>
                <SelectItem value="cliente-z">Cliente Z MEI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data e Hora */}
          <div className="grid gap-2">
            <Label htmlFor="datetime">Data e Hora</Label>
            <Input id="datetime" type="datetime-local" className="w-full" />
          </div>

          {/* Origem e Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">Origem</Label>
              <Input id="origin" placeholder="Endereço de origem" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destino</Label>
              <Input id="destination" placeholder="Endereço de destino" />
            </div>
          </div>

          {/* Preço */}
          <div className="grid gap-2">
            <Label htmlFor="price">Preço</Label>
            <Input id="price" type="number" placeholder="0.00" step="0.01" />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Salvar Orçamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
