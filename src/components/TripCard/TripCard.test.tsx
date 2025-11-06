import { render, screen, fireEvent } from "@testing-library/react"
import TripCard from "./index"
import { useNavigate } from "react-router-dom"

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}))

describe("TripCard", () => {
  const mockNavigate = jest.fn()
  const mockTrip = {
    id: "trip-1", 
    origem: "São Paulo",
    destino: "Rio de Janeiro",
    car_id: "Fiat Uno",
    driver_id: ["João Silva"],
    data_hora_viagem: "2025-10-10T08:30:00Z",
    date_hour_return_trip: "2025-10-12T18:00:00Z",
    cliente_id: "Cliente XPTO",
  }

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useNavigate as jest.Mock).mockReturnValue(mockNavigate)
  })

  test("renderiza informações principais da viagem", () => {
    render(<TripCard trip={mockTrip} />)

    expect(screen.getByText("Origem:")).toBeInTheDocument()
    expect(screen.getByText("São Paulo")).toBeInTheDocument()
    expect(screen.getByText("Destino:")).toBeInTheDocument()
    expect(screen.getByText("Rio de Janeiro")).toBeInTheDocument()
    expect(screen.getByText("Carro:")).toBeInTheDocument()
    expect(screen.getByText("Fiat Uno")).toBeInTheDocument()
    expect(screen.getByText("Motorista:")).toBeInTheDocument()
    expect(screen.getByText("João Silva")).toBeInTheDocument()
    expect(screen.getByText("Cliente:")).toBeInTheDocument()
    expect(screen.getByText("Cliente XPTO")).toBeInTheDocument()
  })

  test("formata corretamente as datas de ida e retorno", () => {
    render(<TripCard trip={mockTrip} />)

    const dataIda = new Date(mockTrip.data_hora_viagem).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    })
    const dataVolta = new Date(mockTrip.date_hour_return_trip).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    })

    expect(screen.getByText(dataIda)).toBeInTheDocument()
    expect(screen.getByText(dataVolta)).toBeInTheDocument()
  })

  test("navega para /Budget ao clicar no botão", () => {
    render(<TripCard trip={mockTrip} />)

    const button = screen.getByRole("button", { name: /Página de Orçamentos/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith("/Budget")
  })
})
