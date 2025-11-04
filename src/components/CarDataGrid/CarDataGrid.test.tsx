import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import { useCar, useUpdateCar, useDeleteCar } from "@/services/hooks/useCar"
import { useToast } from "@/hooks/use-toast"
import { CarDataGrid } from "."

jest.mock("@/services/hooks/useCar")
jest.mock("@/hooks/use-toast")

const mutateAsyncMock = jest.fn()
const toastMock = jest.fn()

  ; (useCar as jest.Mock).mockReturnValue({
    data: [
      { id: "1", model: "Fusca", plate: "ABC1234", consumption: 10, fixed_cost: 500 },
      { id: "2", model: "Gol", plate: "XYZ5678", consumption: 12, fixed_cost: 600 }
    ]
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
    const fuscaElements = screen.getAllByText("Fusca")
    const golElements = screen.getAllByText("Gol")
    expect(fuscaElements[0]).toBeInTheDocument()
    expect(golElements[0]).toBeInTheDocument()
  })

  test("inicia edição de carro", () => {
    render(<CarDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    const inputs = screen.getAllByDisplayValue("Fusca")
    expect(inputs[0]).toBeInTheDocument()
  })

  test("cancela edição", () => {
    render(<CarDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    fireEvent.click(screen.getByText(/Cancelar/i))
    const fuscaElements = screen.getAllByText("Fusca")
    expect(fuscaElements[0]).toBeInTheDocument()
  })

  test("salva edição de carro", async () => {
    render(<CarDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    const input = screen.getAllByDisplayValue("Fusca")[0]
    fireEvent.change(input, { target: { value: "Fusca Editado" } })
    fireEvent.click(screen.getByText(/Salvar/i))

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: "1",
        data: expect.objectContaining({ model: "Fusca Editado" }),
      })
    )
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: "Sucesso"
    }))
  })

  test("deleta carro", async () => {
    render(<CarDataGrid />)
    fireEvent.click(screen.getAllByText(/Excluir/i)[0])
    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalledWith("1"))
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: "Sucesso"
    }))
  })

  test("mostra mensagem quando não há carros", () => {
    ; (useCar as jest.Mock).mockReturnValueOnce({ data: [] })
    render(<CarDataGrid />)
    expect(screen.getByText(/Nenhum carro cadastrado/i)).toBeInTheDocument()
  })
})
