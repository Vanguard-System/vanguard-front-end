import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useCar } from "@/services/hooks/useCar"
import { useDriver } from "@/services/hooks/useDriver"
import { useClient } from "@/services/hooks/useClient"
import { useUpdateBudgetStatus } from "@/services/hooks/useBudget"
import BudgetCard from "."

jest.mock("@/services/hooks/useCar")
jest.mock("@/services/hooks/useDriver")
jest.mock("@/services/hooks/useClient")
jest.mock("@/services/hooks/useBudget")

jest.mock("@react-pdf/renderer", () => {
  const React = require("react")
  return {
    Page: (props: any) => React.createElement("div", props, props.children),
    Text: (props: any) => React.createElement("span", props, props.children),
    View: (props: any) => React.createElement("div", props, props.children),
    Document: (props: any) => React.createElement("div", props, props.children),
    StyleSheet: { create: (styles: any) => styles },
    pdf: () => ({ toBlob: jest.fn(() => Promise.resolve(new Blob())) }),
  }
})

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}))

const mockCars = [{ id: "1", model: "Fusca", plate: "ABC1234" }]
const mockDrivers = [{ id: "1", name: "João" }]
const mockClients = [{ id: "1", name: "Cliente X", phone: "5511999999999" }]

const mutateAsyncStatusMock = jest.fn<Promise<void>, [any]>()
const mutateAsyncUpdateMock = jest.fn<Promise<void>, [any]>()
const mutateDeleteMock = jest.fn<void, [any]>()

  ; (useCar as jest.Mock).mockReturnValue({ data: mockCars })
  ; (useDriver as jest.Mock).mockReturnValue({ data: mockDrivers })
  ; (useClient as jest.Mock).mockReturnValue({ data: mockClients })
  ; (useUpdateBudgetStatus as jest.Mock).mockReturnValue({
    mutate: mutateAsyncStatusMock,
    mutateAsync: mutateAsyncStatusMock,
    isLoading: false,
    isError: false,
    data: null,
    error: null,
    reset: jest.fn(),
    status: "success",
  } as any)

const queryClient = new QueryClient()

const mockOrcamento = {
  id: "1",
  origem: "São Paulo",
  destino: "Rio de Janeiro",
  car_id: "1",
  driver_id: ["1"], 
  cliente_id: "1",
  data_hora_viagem: "2025-11-03T10:00",
  data_hora_viagem_retorno: "2025-11-03T18:00",
  preco_viagem: 500,
  lucroDesejado: 150,
  status: "Pendente",
  distancia_total: 400,
  custoExtra: 100,
  pedagio: 50,
  impostoPercent: 9
}

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <BudgetCard
        orcamento={mockOrcamento}
        updateBudget={{
          mutate: mutateAsyncUpdateMock,
          mutateAsync: mutateAsyncUpdateMock,
          isLoading: false,
          isError: false,
          data: null,
          error: null,
          reset: jest.fn(),
          status: "success",
        } as any}
        deleteBudget={{
          mutate: mutateDeleteMock,
          mutateAsync: mutateDeleteMock,
          isLoading: false,
          isError: false,
          data: null,
          error: null,
          reset: jest.fn(),
          status: "success",
        } as any}
      />
    </QueryClientProvider>
  )

describe("BudgetCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza informações básicas", () => {
    renderComponent()
    expect(screen.getByText(/São Paulo/i)).toBeInTheDocument()
    expect(screen.getByText(/Rio de Janeiro/i)).toBeInTheDocument()
    expect(screen.getByText(/R\$ 500,00/i)).toBeInTheDocument()
    expect(screen.getByText(/Lucro:/i)).toBeInTheDocument()
    expect(screen.getByText(/Pendente/i)).toBeInTheDocument()
  })

  test("abre modo de edição e salva alterações", async () => {
    renderComponent()
    fireEvent.click(screen.getByText(/Editar/i))

    const origemInput = screen.getByDisplayValue("São Paulo")
    fireEvent.change(origemInput, { target: { value: "Campinas" } })

    fireEvent.click(screen.getByText(/Salvar/i))

    await waitFor(() =>
      expect(mutateAsyncUpdateMock).toHaveBeenCalledWith({
        id: "1",
        data: expect.objectContaining({ origem: "Campinas" }),
      })
    )
  })

  test("botão de WhatsApp gera link correto", () => {
    renderComponent()
    window.open = jest.fn()
    fireEvent.click(screen.getByText(/Enviar no WhatsApp/i))

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("https://wa.me/55"),
      "_blank"
    )
  })

  test("botão de Holerite gera PDF", async () => {
    renderComponent()
    const fileSaver = require("file-saver")
    fireEvent.click(screen.getByText(/Holerite/i))
    await waitFor(() => expect(fileSaver.saveAs).toHaveBeenCalled())
  })
})
