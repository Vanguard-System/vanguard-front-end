import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Header from "."

const navigateMock = jest.fn()

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => navigateMock,
}))

jest.mock("@/services/auth", () => ({
  logout: jest.fn(),
}))

jest.mock("@/services/hooks/useUsers", () => ({
  useCurrentUser: () => ({
    data: { username: "Fulano" },
    isLoading: false,
  }),
}))

const renderHeader = () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
}

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza logo, usuário e botões", () => {
    renderHeader()

    expect(screen.getByAltText("Descrição da imagem")).toBeInTheDocument()
    expect(screen.getByText("Fulano")).toBeInTheDocument()
    expect(screen.getByText("Administrador")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Sair/i })).toBeInTheDocument()

    const settingsButtons = screen.getAllByRole("button")
    const settingsButton = settingsButtons.find((btn) =>
      btn.innerHTML.includes("lucide-settings")
    )
    expect(settingsButton).toBeDefined()
  })

  test("abre e fecha o menu mobile", () => {
    renderHeader()
    const allButtons = screen.getAllByRole("button")
    const menuButton = allButtons[0]
    fireEvent.click(menuButton)
    expect(screen.getByPlaceholderText(/Pesquisar.../i)).toBeInTheDocument()
    fireEvent.click(menuButton)
  })
})
