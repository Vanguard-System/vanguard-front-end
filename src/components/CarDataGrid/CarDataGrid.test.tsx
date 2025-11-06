import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useCar, useUpdateCar, useDeleteCar } from "@/services/hooks/useCar"
import { useToast } from "@/hooks/use-toast"
import { CarDataGrid } from "."

jest.mock("@/services/hooks/useCar")
jest.mock("@/hooks/use-toast")

const mutateAsyncMock = jest.fn().mockResolvedValue({})
const toastMock = jest.fn()

  ; (useCar as jest.Mock).mockReturnValue({
    data: [
      { id: "1", model: "Fusca", plate: "ABC1234", consumption: 10, fixed_cost: 500 },
      { id: "2", model: "Gol", plate: "XYZ5678", consumption: 12, fixed_cost: 600 },
    ],
  })

  ; (useUpdateCar as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock })
  ; (useDeleteCar as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock })
  ; (useToast as jest.Mock).mockReturnValue({ toast: toastMock })

describe("CarDataGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza carros na tabela", () => {
    render(<CarDataGrid />)
    expect(screen.getAllByText("Fusca")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Gol")[0]).toBeInTheDocument()
  })

  test("inicia edição de carro", () => {
    render(<CarDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    expect(screen.getAllByDisplayValue("Fusca")[0]).toBeInTheDocument()
  })

  test("cancela edição", () => {
    render(<CarDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    fireEvent.click(screen.getByText(/Cancelar/i))
    expect(screen.getAllByText("Fusca")[0]).toBeInTheDocument()
  })

  test("mostra mensagem quando não há carros", () => {
    ; (useCar as jest.Mock).mockReturnValueOnce({ data: [] })
    render(<CarDataGrid />)
    expect(screen.getByText(/Nenhum carro cadastrado/i)).toBeInTheDocument()
  })
})
