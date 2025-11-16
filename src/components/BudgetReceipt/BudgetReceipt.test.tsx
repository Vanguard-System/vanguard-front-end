// BudgetReceipt.test.tsx
import React from "react"
import { render } from "@testing-library/react"
import BudgetReceipt from "."

jest.mock("@react-pdf/renderer", () => ({
  StyleSheet: { create: (styles: any) => styles },
  Document: ({ children }: any) => <div>{children}</div>,
  Page: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  View: ({ children }: any) => <div>{children}</div>,
}))

describe("BudgetReceipt", () => {
  const dadosMock = {
    cliente: "Cliente X",
    origem: "São Paulo",
    destino: "Rio de Janeiro",
    data_hora_viagem: "2025-11-03T10:00",
    data_hora_viagem_retorno: "2025-11-03T18:00",
    preco_viagem: 500,
    distancia_total: 400,
  }

  it("renderiza todas as informações corretamente", () => {
    const { getByText } = render(<BudgetReceipt dados={dadosMock} />)
    expect(getByText(/COMPROVANTE DE VIAGEM/i)).toBeInTheDocument()
    expect(getByText(/Cliente:/i)).toBeInTheDocument()
    expect(getByText(/Cliente X/i)).toBeInTheDocument()
    expect(getByText(/Origem:/i)).toBeInTheDocument()
    expect(getByText(/São Paulo/i)).toBeInTheDocument()
    expect(getByText(/Destino:/i)).toBeInTheDocument()
    expect(getByText(/Rio de Janeiro/i)).toBeInTheDocument()
    expect(getByText(/Distância Total:/i)).toBeInTheDocument()
    expect(getByText(/400 km/i)).toBeInTheDocument()
    expect(getByText(/Valor Total:/i)).toBeInTheDocument()
    expect(getByText(/R\$ 500.00/i)).toBeInTheDocument()
  })
})
