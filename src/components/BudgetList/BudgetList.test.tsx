import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useBudget, useUpdateBudget, useDeleteBudget } from "@/services/hooks/useBudget"
import type { Orcamento } from "@/types/orcamento"
import BudgetList from "."

jest.mock("@/services/hooks/useBudget")
jest.mock("../BudgetCard", () => ({
  __esModule: true,
  default: jest.fn(({ orcamento, updateBudget, deleteBudget }: any) => (
    <div>
      <p>{orcamento.origem}</p>
      <button onClick={() => updateBudget.mutateAsync({ id: orcamento.id, data: { origem: "Alterado" } })}>
        Atualizar
      </button>
      <button onClick={() => deleteBudget.mutate(orcamento.id)}>Excluir</button>
    </div>
  )),
}))

const mutateAsyncMock = jest.fn<Promise<void>, [any]>()
const mutateDeleteMock = jest.fn<void, [any]>()

const queryClient = new QueryClient()

describe("BudgetList", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("mostra loading enquanto busca orçamentos", () => {
    ; (useBudget as jest.Mock).mockReturnValue({ data: [], isLoading: true })
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetList />
      </QueryClientProvider>
    )
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
  })

  test("renderiza lista de orçamentos", () => {
    const mockOrcamentos: Orcamento[] = [
      {
        id: "1",
        origem: "São Paulo",
        destino: "Rio",
        car_id: "1",
        driver_id: ["1"],
        cliente_id: "1",
        data_hora_viagem: "",
        data_hora_viagem_retorno: "",     // ✔ nome correto
        preco_viagem: 100,
        lucroDesejado: 50,
        status: "Pendente",
        distancia_total: 400,
        custoExtra: 0,                    // ✔ obrigatórios na interface
        pedagio: 0,
        impostoPercent: 0,
      },
      {
        id: "2",
        origem: "Campinas",
        destino: "Belo Horizonte",
        car_id: "2",
        driver_id: ["2"],
        cliente_id: "2",
        data_hora_viagem: "",
        data_hora_viagem_retorno: "",     // ✔ nome correto
        preco_viagem: 200,
        lucroDesejado: 80,
        status: "Aprovada",
        distancia_total: 600,
        custoExtra: 0,
        pedagio: 0,
        impostoPercent: 0,
      },
    ];

      ; (useBudget as jest.Mock).mockReturnValue({ data: mockOrcamentos, isLoading: false })
      ; (useUpdateBudget as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock })
      ; (useDeleteBudget as jest.Mock).mockReturnValue({ mutate: mutateDeleteMock })

    render(
      <QueryClientProvider client={queryClient}>
        <BudgetList />
      </QueryClientProvider>
    )

    expect(screen.getByText("São Paulo")).toBeInTheDocument()
    expect(screen.getByText("Campinas")).toBeInTheDocument()
  })

  test("chama updateBudget e deleteBudget ao interagir com BudgetCard", async () => {
    const mockOrcamentos: Orcamento[] = [
      {
        id: "1",
        origem: "São Paulo",
        destino: "Rio",
        car_id: "1",
        driver_id: ["1"],
        cliente_id: "1",
        data_hora_viagem: "",
        data_hora_viagem_retorno: "",  
        preco_viagem: 100,
        lucroDesejado: 50,
        status: "Pendente",
        distancia_total: 400,
        custoExtra: 0,                 
        pedagio: 0,
        impostoPercent: 0,
      },
    ];

      ; (useBudget as jest.Mock).mockReturnValue({ data: mockOrcamentos, isLoading: false })
      ; (useUpdateBudget as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock })
      ; (useDeleteBudget as jest.Mock).mockReturnValue({ mutate: mutateDeleteMock })

    render(
      <QueryClientProvider client={queryClient}>
        <BudgetList />
      </QueryClientProvider>
    )

    fireEvent.click(screen.getByText(/Atualizar/i))
    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalledWith({ id: "1", data: { origem: "Alterado" } }))

    fireEvent.click(screen.getByText(/Excluir/i))
    expect(mutateDeleteMock).toHaveBeenCalledWith("1")
  })
})
