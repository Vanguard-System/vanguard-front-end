import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CarRegisterForm } from "."
import { useCreateCar } from "@/services/hooks/useCar"

jest.mock("@/services/hooks/useCar")

const mutateAsyncMock = jest.fn()

  ; (useCreateCar as jest.Mock).mockReturnValue({
    mutateAsync: mutateAsyncMock,
  })

describe("CarRegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza o formulário com campos básicos", () => {
    render(<CarRegisterForm />)
    expect(screen.getByLabelText(/modelo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/placa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/consumo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/preço fixo/i)).toBeInTheDocument()
  })

  test("exibe erro ao tentar enviar sem preencher modelo", async () => {
    render(<CarRegisterForm />)
    fireEvent.click(screen.getByRole("button", { name: /cadastrar carro/i }))
    expect(await screen.findByText(/modelo é obrigatório/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("exibe erro ao tentar enviar sem preencher placa", async () => {
    render(<CarRegisterForm />)
    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Fusca" } })
    fireEvent.click(screen.getByRole("button", { name: /cadastrar carro/i }))
    expect(await screen.findByText(/placa é obrigatória/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("envia o formulário com sucesso", async () => {
    mutateAsyncMock.mockResolvedValueOnce({})

    render(<CarRegisterForm />)

    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Fusca" } })
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: "ABC1234" } })
    fireEvent.change(screen.getByLabelText(/consumo/i), { target: { value: "8.5" } })
    fireEvent.change(screen.getByLabelText(/preço fixo/i), { target: { value: "500" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar carro/i }))

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        model: "Fusca",
        plate: "ABC1234",
        consumption: 8.5,
        fixed_cost: 500,
      })
    )

    expect(await screen.findByText(/carro cadastrado com sucesso/i)).toBeInTheDocument()
  })

  test("exibe erro ao falhar no cadastro", async () => {
    mutateAsyncMock.mockRejectedValueOnce({
      response: { data: { message: "Erro de backend" } },
    })

    render(<CarRegisterForm />)

    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Gol" } })
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: "XYZ5678" } })
    fireEvent.change(screen.getByLabelText(/consumo/i), { target: { value: "10" } })
    fireEvent.change(screen.getByLabelText(/preço fixo/i), { target: { value: "600" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar carro/i }))

    await waitFor(() =>
      expect(screen.getByText(/erro de backend/i)).toBeInTheDocument()
    )
  })
})
