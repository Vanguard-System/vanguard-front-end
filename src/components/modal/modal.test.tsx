import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useDriver } from "@/services/hooks/useDriver"
import { useClient } from "@/services/hooks/useClient"
import { useCar } from "@/services/hooks/useCar"
import { useCreateBudget } from "@/services/hooks/useBudget"
import BudgetModal from "."

jest.mock("@/services/hooks/useDriver")
jest.mock("@/services/hooks/useClient")
jest.mock("@/services/hooks/useCar")
jest.mock("@/services/hooks/useBudget")

describe("BudgetModal", () => {
  const mockCreateBudget = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

      ; (useDriver as jest.Mock).mockReturnValue({
        data: [
          { id: "d1", name: "João" },
          { id: "d2", name: "Maria" },
        ],
        isLoading: false,
      })

      ; (useClient as jest.Mock).mockReturnValue({
        data: [
          { id: "c1", name: "Cliente A" },
          { id: "c2", name: "Cliente B" },
        ],
        isLoading: false,
      })

      ; (useCar as jest.Mock).mockReturnValue({
        data: [
          { id: "car1", model: "Fiat Uno" },
          { id: "car2", model: "Gol" },
        ],
        isLoading: false,
      })

      ; (useCreateBudget as jest.Mock).mockReturnValue({
        mutate: mockCreateBudget,
        isPending: false,
        isSuccess: false,
        isError: false,
      })
  })

  test("renderiza o modal com título e campos principais", () => {
    render(<BudgetModal open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByText("Cadastrar Orçamento")).toBeInTheDocument()
    expect(screen.getByText("Motoristas")).toBeInTheDocument()
    expect(screen.getByText("Carro")).toBeInTheDocument()
    expect(screen.getByText("Cliente")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Salvar Orçamento/i })).toBeInTheDocument()
  })

  test("permite selecionar motoristas", () => {
    render(<BudgetModal open={true} onOpenChange={mockOnOpenChange} />)

    const motoristasBtn = screen.getByRole("button", { name: /Selecione motoristas/i })
    fireEvent.click(motoristasBtn)

    const checkbox = screen.getByLabelText("João")
    fireEvent.click(checkbox)

    fireEvent.mouseDown(document.body)

    expect(screen.getByRole("button", { name: /João/i })).toBeInTheDocument()
  })

  test("preenche campos e envia orçamento corretamente", async () => {
    render(<BudgetModal open={true} onOpenChange={mockOnOpenChange} />)

    const motoristasBtn = screen.getByRole("button", { name: /Selecione motoristas/i })
    fireEvent.click(motoristasBtn)
    fireEvent.click(screen.getByLabelText("João"))

    const selects = screen.getAllByRole("combobox")
    fireEvent.change(selects[0], { target: { value: "car1" } }) 
    fireEvent.change(selects[1], { target: { value: "c1" } }) 

    fireEvent.change(screen.getByPlaceholderText("Endereço de origem"), {
      target: { value: "Rua A" },
    })
    fireEvent.change(screen.getByPlaceholderText("Endereço de destino"), {
      target: { value: "Rua B" },
    })

    const numberInputs = screen.getAllByRole("spinbutton")
    fireEvent.change(numberInputs[0], { target: { value: "50" } }) 
    fireEvent.change(numberInputs[1], { target: { value: "10" } }) 
    fireEvent.change(numberInputs[2], { target: { value: "200" } }) 
    fireEvent.change(numberInputs[3], { target: { value: "30" } }) 

    fireEvent.click(screen.getByRole("button", { name: /Salvar Orçamento/i }))

    await waitFor(() => {
      expect(mockCreateBudget).toHaveBeenCalledTimes(1)
    })

    const payload = mockCreateBudget.mock.calls[0][0]
    expect(payload.driver_id).toBe("d1")
    expect(payload.car_id).toBe("car1")
    expect(payload.cliente_id).toBe("c1")
    expect(payload.pedagio).toBe(50)
    expect(payload.lucroDesejado).toBe(200)
    expect(payload.impostoPercent).toBe(10)
    expect(payload.custoExtra).toBe(30)
  })

  test("fecha o modal ao clicar em Cancelar", () => {
    render(<BudgetModal open={true} onOpenChange={mockOnOpenChange} />)
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }))
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})
