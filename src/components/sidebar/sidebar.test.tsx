import { render, screen } from "@testing-library/react"
import SidebarApp from "./index"

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), 
      removeListener: jest.fn(), 
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

describe("SidebarApp", () => {
  test("renderiza todos os itens do menu corretamente", () => {
    render(<SidebarApp />)

    const menuItems = ["Home", "Motorista", "Carro", "Clientes", "Orçamentos"]

    for (const item of menuItems) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/Home")
    expect(screen.getByText("Motorista").closest("a")).toHaveAttribute("href", "/Driver")
    expect(screen.getByText("Carro").closest("a")).toHaveAttribute("href", "/Car")
    expect(screen.getByText("Clientes").closest("a")).toHaveAttribute("href", "/Client")
    expect(screen.getByText("Orçamentos").closest("a")).toHaveAttribute("href", "/Budget")
  })
})
