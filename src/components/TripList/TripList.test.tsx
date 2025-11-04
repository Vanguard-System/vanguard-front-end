import { render, screen } from "@testing-library/react"
import BudgetList from "./index"
import { useBudget } from "@/services/hooks/useBudget"

jest.mock("@/services/hooks/useBudget")
jest.mock("../TripCard", () => jest.fn(() => <div data-testid="trip-card">TripCard</div>))

describe("BudgetList", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("exibe 'Carregando...' quando está carregando", () => {
    ; (useBudget as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    })

    render(<BudgetList />)

    expect(screen.getByText("Carregando...")).toBeInTheDocument()
  })

  test("renderiza lista de TripCard quando há orçamentos", () => {
    const mockData = [
      {
        id: "1",
        origem: "São Paulo",
        destino: "Rio de Janeiro",
        car_id: "Fiat Uno",
        driver_id: "João",
        data_hora_viagem: "2025-10-10T08:00:00Z",
        date_hour_return_trip: "2025-10-11T18:00:00Z",
        cliente_id: "XPTO",
      },
      {
        id: "2",
        origem: "Curitiba",
        destino: "Florianópolis",
        car_id: "Onix",
        driver_id: "Maria",
        data_hora_viagem: "2025-11-01T07:00:00Z",
        date_hour_return_trip: "2025-11-03T19:00:00Z",
        cliente_id: "Zeta",
      },
    ]

      ; (useBudget as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
      })

    render(<BudgetList />)

    expect(screen.getAllByTestId("trip-card")).toHaveLength(2)
  })
})
