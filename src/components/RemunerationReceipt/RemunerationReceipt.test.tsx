import { render, screen } from "@testing-library/react"
import RemunerationReceipt from "./index"

jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: any) => <div>{children}</div>,
  Page: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  View: ({ children }: any) => <div>{children}</div>,
  StyleSheet: { create: (styles: any) => styles },
}))

describe("RemunerationReceipt", () => {
  const mockData = {
    funcionario: "João da Silva",
    mes: "Outubro",
    ano: "2025",
    viagens: {
      quantidade: 5,
      valor: 150.75,
      totalDays: 12,
      totalRemuneration: 753.75,
    },
  }

  test("renderiza corretamente os dados do holerite", () => {
    render(<RemunerationReceipt dados={mockData} />)

    expect(screen.getByText("HOLERITE")).toBeInTheDocument()
    expect(screen.getByText("Outubro/2025")).toBeInTheDocument()
    expect(screen.getByText(/João da Silva/)).toBeInTheDocument()
    expect(screen.getByText(/Quantidade:/)).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText(/R\$ 150.75/)).toBeInTheDocument()
    expect(screen.getByText(/12/)).toBeInTheDocument()
    expect(screen.getByText(/R\$ 753.75/)).toBeInTheDocument()
  })
})
