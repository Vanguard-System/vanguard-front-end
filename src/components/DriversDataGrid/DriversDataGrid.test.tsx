import { render, screen, fireEvent, waitFor } from "@testing-library/react"

jest.mock("../RemunerationReceipt", () => () => null)

jest.mock("@react-pdf/renderer", () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn().mockResolvedValue(new Blob()),
  })),
  Document: () => null,
  Page: () => null,
  Text: () => null,
  View: () => null,
  StyleSheet: { create: jest.fn(() => ({})) },
}))

jest.mock("file-saver", () => ({ saveAs: jest.fn() }))

const mutateAsyncMock = jest.fn()
const getDriverRemunerationMock = jest.fn().mockResolvedValue({
  driver: { name: "Lucas" },
  month: 10,
  year: 2025,
  trips: [{}, {}],
  dailyRate: 100,
  totalDays: 2,
  totalRemuneration: 200,
})

jest.mock("@/services/hooks/useDriver", () => ({
  useDriver: () => ({
    data: [
      { id: "1", name: "Lucas", cpf: "12345678901", email: "lucas@example.com", driverCost: 500, dailyPriceDriver: 100 },
      { id: "2", name: "Ana", cpf: "98765432100", email: "ana@example.com", driverCost: 600, dailyPriceDriver: 120 },
    ],
  }),
  useUpdateDriver: () => ({ mutateAsync: mutateAsyncMock }),
  useDeleteDriver: () => ({ mutateAsync: mutateAsyncMock }),
}))

jest.mock("@/services/driver", () => ({ getDriverRemuneration: getDriverRemunerationMock }))

jest.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: jest.fn() }) }))

import { DriverDataGrid } from "./index"

describe("DriverDataGrid", () => {
  beforeEach(() => jest.clearAllMocks())

  test("renderiza motoristas na tabela", () => {
    render(<DriverDataGrid />)
    expect(screen.getByText("Lucas")).toBeInTheDocument()
    expect(screen.getByText("Ana")).toBeInTheDocument()
  })

  test("gera holerite do motorista", async () => {
    const { pdf } = require("@react-pdf/renderer")
    const { saveAs } = require("file-saver")

    render(<DriverDataGrid />)

    const payrollButtons = screen.getAllByRole("button", { name: "" })
    fireEvent.click(payrollButtons[0]) 

    await waitFor(() => {
      expect(getDriverRemunerationMock).toHaveBeenCalledWith("1", expect.any(Number), expect.any(Number))
      expect(pdf).toHaveBeenCalled()
      expect(saveAs).toHaveBeenCalled()
    })
  })
})
